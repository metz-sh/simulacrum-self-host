import { pipe } from 'fp-ts/function';
import { SWRResponse } from 'swr';
import { useSafeSWR } from '../hooks/use-safe-swr.hook';
import { SWRMutationResponse } from 'swr/mutation';

export function createSafeSWR<
	T extends SWRResponse<any, any, any> | SWRMutationResponse<any, any, any, any>,
>(result: T) {
	return pipe(result, useSafeSWR);
}
