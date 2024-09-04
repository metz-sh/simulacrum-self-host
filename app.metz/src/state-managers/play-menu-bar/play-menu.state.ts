export type PlayMenuBarState = {
	state: 'enlarged' | 'collapsed';
	setState: (state: PlayMenuBarState['state']) => void;
};
