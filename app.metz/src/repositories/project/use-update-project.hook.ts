import { SWRMutationConfiguration } from 'swr/mutation';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { Project } from './models/project.model';
import { useImmutableHTTP } from '../../hooks/use-immutable-http.hook';

type UpdateProjectParams = Partial<Pick<Project, 'name' | 'description' | 'project_art'>>;

export function useUpdateProject(params: { id: string }) {
	return useImmutableHTTP<Project, UpdateProjectParams>({
		url: getUpdateProjectAPIUrl(params.id),
		options: {
			method: 'PATCH',
		},
		swrOptions: {
			revalidate: false,
		},
	});
}

function getUpdateProjectAPIUrl(id: string) {
	return `${getBaseAPIPath()}/v1/projects/${id}`;
}
