import { create } from 'zustand';
import { TemplateMenuBarState } from './template-menu.state';

export const useTemplateMenubar = create<TemplateMenuBarState>((set, get) => ({
	state: 'collapsed',
	setState(state) {
		set({
			state,
		});
	},
}));
