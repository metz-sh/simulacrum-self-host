import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { Project } from './models/project.model';
import { useCacheableHTTP } from '../../hooks/use-cacheable-http.hook';

export type EmbedResponse = {
	project: Pick<
		Project,
		'project_id' | 'project_artifacts' | 'name' | 'description' | 'project_art'
	>;
};

export function useEmbedArtifacts(code: string) {
	return useCacheableHTTP<EmbedResponse>({
		url: getEmbedArtifactsAPIUrl(code),
		swrOptions: {
			revalidateIfStale: false,
			revalidateOnFocus: false,
		},
	});
}

export function getEmbedArtifactsAPIUrl(code: string) {
	return `${getBaseAPIPath()}/v1/embeds/${code}`;
}
