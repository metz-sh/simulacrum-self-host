import { safeFetch } from '../../helpers/safe-fetch';

export class SWRFetcher {
	constructor(private readonly options: RequestInit = {}) {}

	getEncodedUrl(url: string, params?: Record<string, any>) {
		if (!params) {
			return url;
		}
		const encodedParams = Object.keys(params)
			.filter((key) => params[key] != null) // Optional: filter out null or undefined values
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
			.join('&');

		return `${url}?${encodedParams}`;
	}

	fetch(url: string) {
		return safeFetch(url, this.options);
	}
}
