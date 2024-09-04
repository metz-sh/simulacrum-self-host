import { Project } from '../project/models/project.model';

export type ProjectTemplateWithoutArtifacts = {
	id: number;
	name: string;
	description: string;
	project_art: Project['project_art'];
};

export type ProjectTemplate = ProjectTemplateWithoutArtifacts & {
	project_artifacts: Project['project_artifacts'];
	updated_at: string;
	created_at: string;
};
