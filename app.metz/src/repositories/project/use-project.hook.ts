import useSWR from 'swr';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { AuthenticationError } from '../../errors/authentication-error';
import { safeFetch, swrFetcher } from '../../helpers/safe-fetch';
import { useSafeSWR } from '../../hooks/use-safe-swr.hook';
import { pipe } from 'fp-ts/function';
import { createSafeSWR } from '../../helpers/create-safe-swr';
import { Project } from './models/project.model';
import { useCacheableHTTP } from '../../hooks/use-cacheable-http.hook';

export function useProject(id: string) {
	return useCacheableHTTP<Project>({
		url: getProjectAPIUrl(id),
	});
}

export function getProjectAPIUrl(id: string) {
	return `${getBaseAPIPath()}/v1/projects/${id}`;
}
