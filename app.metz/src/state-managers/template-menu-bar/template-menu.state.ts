export type TemplateMenuBarState = {
	state: 'enlarged' | 'collapsed';
	setState: (state: TemplateMenuBarState['state']) => void;
};
