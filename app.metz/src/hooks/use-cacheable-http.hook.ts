import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { createSafeSWR } from '../helpers/create-safe-swr';
import { SWRImmutableFetcher } from '../common/fetcher/swr-immutable-fetcher';
import useSWR, { SWRConfiguration } from 'swr';
import { SWRFetcher } from '../common/fetcher/swr-fetcher';

export function useCacheableHTTP<
	Result,
	Params extends Record<string, any> = Record<string, any>,
>(arg: {
	url: string;
	params?: Params;
	options?: RequestInit;
	swrOptions?: SWRConfiguration<Result, Error>;
}) {
	const { url, params, options, swrOptions } = arg;

	const fetcherFactory = new SWRFetcher(options);
	const result = useSWR<Result, Error, string>(
		fetcherFactory.getEncodedUrl(url, params),
		fetcherFactory.fetch.bind(fetcherFactory),
		swrOptions
	);
	return createSafeSWR(result);
}
