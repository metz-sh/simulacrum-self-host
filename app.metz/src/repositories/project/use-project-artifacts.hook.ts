import useSWR from 'swr';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { AuthenticationError } from '../../errors/authentication-error';
import { safeFetch, swrFetcher } from '../../helpers/safe-fetch';
import { useSafeSWR } from '../../hooks/use-safe-swr.hook';
import { pipe } from 'fp-ts/function';
import { createSafeSWR } from '../../helpers/create-safe-swr';
import { Project } from './models/project.model';
import { useCacheableHTTP } from '../../hooks/use-cacheable-http.hook';

export function useProjectArtifacts(id: string) {
	return useCacheableHTTP<
		Pick<Project, 'project_id' | 'project_artifacts' | 'name' | 'server_sequence'>
	>({
		url: getProjectAPIUrl(id),
		swrOptions: {
			revalidateOnFocus: false,
		},
	});
}

export function getProjectAPIUrl(id: string) {
	return `${getBaseAPIPath()}/v1/projects/${id}/artifacts`;
}
