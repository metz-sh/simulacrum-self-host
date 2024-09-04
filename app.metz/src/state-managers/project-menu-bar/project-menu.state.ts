export type ProjectMenuBarState = {
	state: 'enlarged' | 'collapsed';
	setState: (state: ProjectMenuBarState['state']) => void;
};
