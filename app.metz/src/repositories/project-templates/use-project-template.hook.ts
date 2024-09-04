import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { useCacheableHTTP } from '../../hooks/use-cacheable-http.hook';
import { ProjectTemplate } from './project-template.model';

export function useProjectTemplate(id: number) {
	return useCacheableHTTP<ProjectTemplate>({
		url: getProjectTemplatesListAPIUrl(id),
		swrOptions: {
			revalidateOnFocus: false,
			revalidateIfStale: false,
			revalidateOnReconnect: false,
		},
	});
}

export function getProjectTemplatesListAPIUrl(id: number) {
	return `${getBaseAPIPath()}/v1/project_templates/${id}`;
}
