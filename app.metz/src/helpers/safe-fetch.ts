import { useRouter } from 'next/router';
import { AuthenticationError } from '../errors/authentication-error';

export async function safeFetch(apiPath: string, options?: RequestInit) {
	const result = await fetch(apiPath, {
		credentials: 'include',
		headers: {
			'content-type': 'application/json',
			...options?.headers,
		},
		...options,
	});
	if (!result.ok) {
		if ([401].includes(result.status)) {
			throw new AuthenticationError();
		}
		const parsedResult: {
			message: string;
		} = await result.json();
		throw new Error(parsedResult.message);
	}
	const parsedResult = await result.json();
	return parsedResult;
}

export function swrFetcher(params: [apiPath: string, options: RequestInit]) {
	return safeFetch(params[0], params[1]);
}
