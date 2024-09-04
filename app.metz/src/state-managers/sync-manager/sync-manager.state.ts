import {
	AnalyticsEvent,
	StateChangeEvent,
} from '@metz/simulacrum/dist/ui/state-managers/host/host.state';
import { type Observable, type Subscription } from 'rxjs';
import { StoreApi, UseBoundStore } from 'zustand';

export type SyncManagerState = {
	syncStatus: 'synced' | 'syncing' | 'unsynced' | 'errored';
	lastSyncAt: Date;
	isSyncingAllowed: boolean;
	serverSequence: number;

	eventSource$?: Observable<StateChangeEvent<any>>;
	eventSourceSubscription?: Subscription;


	setSyncStatus: (status: SyncManagerState['syncStatus']) => void;
	setIsSyncingAllowed: (isAllowed: boolean) => void;
	setServerSequence: (number: number) => void;

	setEventSource: (
		projectId: string,
		source: NonNullable<SyncManagerState['eventSource$']>,
		syncManagerStore: UseBoundStore<StoreApi<SyncManagerState>>
	) => void;
	setEventSourceSubscription: (sub: Subscription) => void;

	cancelSubscriptions: () => void;
};
