import { SWRMutationConfiguration } from 'swr/mutation';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { Project } from './models/project.model';
import { useImmutableHTTP } from '../../hooks/use-immutable-http.hook';

export function useDeleteProject(params: { id: string }) {
	return useImmutableHTTP<void, {}>({
		url: getUpdateProjectAPIUrl(params.id),
		options: {
			method: 'DELETE',
		},
		swrOptions: {
			revalidate: false,
		},
	});
}

function getUpdateProjectAPIUrl(id: string) {
	return `${getBaseAPIPath()}/v1/projects/${id}`;
}
