import {
	bufferTime,
	bufferWhen,
	concatMap,
	filter,
	map,
	share,
	tap,
	withLatestFrom,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { SyncManagerState } from './sync-manager.state';
import { StoreApi, UseBoundStore } from 'zustand';
import { BehaviorSubject, Observable, from, fromEvent, merge, timer } from 'rxjs';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { StateChangeEvent } from '@metz/simulacrum/dist/types';

const mergeEvents = (events: StateChangeEvent<any>[]) => {
	// Merge logic here
	return events.reduce(
		(merged, event) => {
			merged[event.source] = event.newState;
			return merged;
		},
		{} as Record<string, any>
	);
};

const manualSaveTrigger$ =
	typeof window === 'undefined'
		? from([])
		: fromEvent<KeyboardEvent>(document, 'keydown').pipe(
				filter((event) => event.key === 's' && (event.metaKey || event.ctrlKey)),
				map(() => [] as StateChangeEvent<any>[])
			);

export function setupSyncPipeline(
	projectId: string,
	eventSource$: NonNullable<SyncManagerState['eventSource$']>,
	syncManagerStore: UseBoundStore<StoreApi<SyncManagerState>>,
	bufferTimeInMs: number
) {
	const syncManagerState$ = new BehaviorSubject<SyncManagerState>(syncManagerStore.getState());
	syncManagerStore.subscribe((state) => syncManagerState$.next(state));

	const sharedEventSource$ = eventSource$.pipe(share());

	const bufferedEvents$ = sharedEventSource$.pipe(
		tap(() => syncManagerStore.getState().setSyncStatus('unsynced')),
		bufferWhen(() =>
			merge(
				timer(bufferTimeInMs), // Emit when buffer time elapses
				manualSaveTrigger$ // Or when manual save is triggered
			)
		),
		filter((events) => events.length > 0)
	);

	const result = bufferedEvents$.pipe(
		map(mergeEvents),
		withLatestFrom(syncManagerState$),
		filter(([_, state]) => state.isSyncingAllowed), // Check if syncing is allowed
		tap(() => syncManagerStore.getState().setSyncStatus('syncing')),
		concatMap(([mergedEvents, state]) =>
			ajax<{ server_sequence: number }>({
				url: getSyncApiUrl(projectId),
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
				},
				body: {
					project_artifacts: mergedEvents,
					new_server_sequence: state.serverSequence + 1,
				},
				withCredentials: true,
			}).pipe(
				tap({
					next: (response) => {
						syncManagerStore.getState().setSyncStatus('synced');
						syncManagerStore
							.getState()
							.setServerSequence(response.response.server_sequence);
					},
					error: () => {
						syncManagerStore.getState().setSyncStatus('errored');
						syncManagerStore.getState().setIsSyncingAllowed(false);
					},
				})
			)
		)
	);

	const subscription = result.subscribe({
		next: (response) => {},
		error: (err) => {},
		complete: () => {},
	});

	syncManagerStore.getState().setEventSourceSubscription(subscription);
}

function getSyncApiUrl(id: string) {
	return `${getBaseAPIPath()}/v1/projects/${id}/artifacts`;
}
