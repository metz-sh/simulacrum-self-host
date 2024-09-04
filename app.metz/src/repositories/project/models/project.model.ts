type SourceCode = {
	path: string;
	value: string;
} & FileModifiers;

type FileModifiers = Partial<{
	deleteDisabled: boolean;
}>;

type RawStorySetup = {
	id: string;
	title: string;
	script: {
		compiled: string;
		raw: string;
	};
	resolutionNodeMap?: any;
};

type FSItem = {
	type: 'folder' | 'file';
	path: string;
} & (
	| { type: 'folder' }
	| {
			type: 'file';
			value: string;
	  }
);

export interface Project {
	project_id: string;
	name: string;
	description: string;
	updated_at: string;
	created_at: string;
	project_art: {
		iconString: string;
		iconColorVariant: 'dark' | 'light';
	};
	project_artifacts: {
		project: FSItem[];
		entryFilePath: string;
		storySetups: RawStorySetup[];
		display?: Record<string, any>;
		build?: any;
		notes?: {
			notesContent?: string;
		};
		updatedAt: string;
	};
	server_sequence: number;
}
