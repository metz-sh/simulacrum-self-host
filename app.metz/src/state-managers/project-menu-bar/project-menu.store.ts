import { create } from 'zustand';
import { ProjectMenuBarState } from './project-menu.state';

export const useProjectMenubar = create<ProjectMenuBarState>((set, get) => ({
	state: 'collapsed',
	setState(state) {
		set({
			state,
		});
	},
}));
