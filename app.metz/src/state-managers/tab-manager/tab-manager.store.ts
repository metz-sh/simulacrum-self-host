import { create } from 'zustand';
import { TabManagerState } from './tab-manager.state';
import { TabStates } from '../../components/tab-manager/tab-states.enum';

export const useTabManager = create<TabManagerState>((set, get) => ({
	selectedTab: TabStates.Projects,
	setSelectedTab(id) {
		set({
			selectedTab: id,
		});
	},
}));
