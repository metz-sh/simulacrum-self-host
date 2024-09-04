import { safeFetch } from '../../helpers/safe-fetch';

export class SWRImmutableFetcher {
	constructor(private readonly options: RequestInit = {}) {}

	fetch<T extends Record<string, any>>(url: string, options: { arg: T }) {
		const jsonBody = JSON.stringify(options.arg);
		return safeFetch(url, {
			...this.options,
			body: jsonBody,
		});
	}
}
