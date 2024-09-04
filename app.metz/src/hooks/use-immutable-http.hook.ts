import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { createSafeSWR } from '../helpers/create-safe-swr';
import { SWRImmutableFetcher } from '../common/fetcher/swr-immutable-fetcher';

export function useImmutableHTTP<Result, Params extends Record<string, any>>(arg: {
	url: string;
	options: RequestInit;
	swrOptions?: SWRMutationConfiguration<Result, Error, string, Params>;
}) {
	const { url, options, swrOptions } = arg;
	const fetcherFactory = new SWRImmutableFetcher(options);
	const result = useSWRMutation<Result, Error, string, Params>(
		url,
		fetcherFactory.fetch.bind(fetcherFactory),
		swrOptions
	);
	return createSafeSWR(result);
}
