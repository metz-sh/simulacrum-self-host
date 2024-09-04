import { TabStates } from '../../components/tab-manager/tab-states.enum';

export type TabManagerState = {
	selectedTab: TabStates;
	setSelectedTab: (id: TabStates) => void;
};
