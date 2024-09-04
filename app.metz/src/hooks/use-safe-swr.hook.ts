import { useRouter } from 'next/router';
import useSWR, { SWRHook, SWRResponse } from 'swr';
import { AuthenticationError } from '../errors/authentication-error';
import { SWRMutationResponse } from 'swr/mutation';

export function useSafeSWR<
	T extends SWRResponse<any, any, any> | SWRMutationResponse<any, any, any, any>,
>(swrResponse: T) {
	if (swrResponse.error && swrResponse.error instanceof AuthenticationError) {
		throw swrResponse.error;
	}
	return swrResponse;
}
