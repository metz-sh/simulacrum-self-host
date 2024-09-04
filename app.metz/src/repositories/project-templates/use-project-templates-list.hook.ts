import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { useCacheableHTTP } from '../../hooks/use-cacheable-http.hook';
import { ProjectTemplateWithoutArtifacts } from './project-template.model';

export function useProjectTemplatesList() {
	return useCacheableHTTP<ProjectTemplateWithoutArtifacts[]>({
		url: getProjectTemplatesListAPIUrl(),
	});
}

export function getProjectTemplatesListAPIUrl() {
	return `${getBaseAPIPath()}/v1/project_templates`;
}
