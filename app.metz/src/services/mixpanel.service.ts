import mixpanel, { Dict } from 'mixpanel-browser';
import { Events } from './events/events.enum';

class MixPanel {
	private token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
	private shouldTrack = (() => {
		const envVar = process.env.NEXT_PUBLIC_SHOULD_TRACK;
		if (!envVar) {
			return false;
		}
		return envVar === 'true' ? true : false;
	})();
	constructor() {
		if (this.shouldTrack) {
			if (!this.token) {
				throw new Error('No token found!');
			}
			mixpanel.init(this.token);
		}
	}

	track(event: Events, properties?: Dict) {
		if (!this.shouldTrack) {
			return;
		}
		mixpanel.track(event, properties);
	}
}

export default new MixPanel();
