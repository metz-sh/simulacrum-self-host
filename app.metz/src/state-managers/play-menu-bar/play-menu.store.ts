import { create } from 'zustand';
import { PlayMenuBarState } from './play-menu.state';

export const usePlayMenubar = create<PlayMenuBarState>((set, get) => ({
	state: 'collapsed',
	setState(state) {
		set({
			state,
		});
	},
}));
