import useSWR from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { AuthenticationError } from '../../errors/authentication-error';
import { safeFetch, swrFetcher } from '../../helpers/safe-fetch';
import { useSafeSWR } from '../../hooks/use-safe-swr.hook';
import { pipe } from 'fp-ts/function';
import { createSafeSWR } from '../../helpers/create-safe-swr';
import { Project } from './models/project.model';
import { SWRFetcher } from '../../common/fetcher/swr-fetcher';
import { useImmutableHTTP } from '../../hooks/use-immutable-http.hook';

type CreateProjectParams = {
	template_id?: number;
};

export function useCreateProject() {
	return useImmutableHTTP<Project, CreateProjectParams>({
		url: getCreateProjectAPIUrl(),
		options: {
			method: 'POST',
		},
	});
}

function getCreateProjectAPIUrl() {
	return `${getBaseAPIPath()}/v1/projects`;
}
