import { SWRMutationConfiguration } from 'swr/mutation';
import { getBaseAPIPath } from '../../helpers/get-base-api-path';
import { Project } from './models/project.model';
import { useImmutableHTTP } from '../../hooks/use-immutable-http.hook';

export function useGetEmbedLinkProject(params: { id: string }) {
	return useImmutableHTTP<{ embed_id: string }, never>({
		url: getEmbedLinkAPIUrl(params.id),
		options: {
			method: 'GET',
		},
		swrOptions: {
			revalidate: false,
		},
	});
}

function getEmbedLinkAPIUrl(id: string) {
	return `${getBaseAPIPath()}/v1/embeds?project_uuid=${id}`;
}
