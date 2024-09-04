import { create, useStore } from 'zustand';
import { SyncManagerState } from './sync-manager.state';
import { BehaviorSubject } from 'rxjs';
import { setupSyncPipeline } from './sync-pipeline';
import { createContext, useContext } from 'react';

export const createSyncManager = () =>
	create<SyncManagerState>((set, get) => ({
		syncStatus: 'synced',
		isSyncingAllowed: true,
		serverSequence: 0,
		eventSource$: undefined,
		eventSourceSubscription: undefined,
		analyticsSource$: undefined,
		analyticsSourceSubscription: undefined,
		lastSyncAt: new Date(),

		setSyncStatus: (syncStatus) => {
			const currentSyncStatus = get().syncStatus;
			if (currentSyncStatus === syncStatus) {
				return;
			}
			const update =
				syncStatus === 'synced'
					? {
							syncStatus,
							lastSyncAt: new Date(),
						}
					: {
							syncStatus,
						};
			set(update);
		},
		setIsSyncingAllowed: (isAllowed) => set({ isSyncingAllowed: isAllowed }),
		setServerSequence: (number) => set({ serverSequence: number }),

		setEventSource(projectId, source, syncManagerStore) {
			set({
				eventSource$: source,
			});
			setupSyncPipeline(projectId, source, syncManagerStore, 2 * 1000);
		},

		setEventSourceSubscription(sub) {
			set({
				eventSourceSubscription: sub,
			});
		},
		cancelSubscriptions() {
			get().eventSourceSubscription?.unsubscribe();
		},
	}));

export type SyncManagerStoreStore = ReturnType<typeof createSyncManager>;

export const SyncManagerContext = createContext<ReturnType<typeof createSyncManager> | null>(null);

export const useSyncManager = <T>(
	selector: (state: SyncManagerState) => T,
	equalityFn?: (a: T, b: T) => boolean
) => {
	const store = useContext(SyncManagerContext);
	if (store === null) {
		throw new Error('The component is not under SyncManagerContext!');
	}
	return useStore(store, selector, equalityFn);
};
