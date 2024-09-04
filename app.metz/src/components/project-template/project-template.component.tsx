import { PlaygroundViewFlags } from '@metz/simulacrum/dist/types';
import { memo, useEffect, useState } from 'react';
import { ProjectTemplate } from '../../repositories/project-templates/project-template.model';
import { createSyncManager } from '../../state-managers/sync-manager/sync-manager.store';
import { Box } from '@mantine/core';
const Playground = dynamic(
	import('@metz/simulacrum').then((p) => p.Playground),
	{ ssr: false }
);
import { useProjectTemplate } from '../../repositories/project-templates/use-project-template.hook';
import LoadingComponent from '../loading/loading.component';
import dynamic from 'next/dynamic';

const PlaygroundHost = memo(function (props: {
	template: ProjectTemplate;
	viewFlags: PlaygroundViewFlags;
	height: string;
}) {
	const {
		template: { id, project_artifacts },
		height,
	} = props;
	const projectName = `template_${id}`;

	if (!project_artifacts.storySetups.length) {
		throw new Error('No stories found! Please contact the author.');
	}
	if (!project_artifacts.build) {
		throw new Error('No build found!');
	}

	const [syncManager] = useState(() => createSyncManager());

	useEffect(() => {
		return syncManager.getState().cancelSubscriptions;
	}, []);

	return (
		<div>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						height,
					}}
				>
					<Playground
						projectName={projectName}
						display={project_artifacts.display}
						height={height}
						build={project_artifacts.build}
						storySetups={project_artifacts.storySetups as [any, ...any[]]}
						enableModalProvider
						viewFlags={props.viewFlags}
					/>
				</div>
			</Box>
		</div>
	);
});

export default function (props: { templateId: number; height: string }) {
	const {
		data: projectTemplate,
		isLoading,
		isValidating,
		mutate,
	} = useProjectTemplate(props.templateId);

	useEffect(() => {
		return () => {
			mutate(undefined);
		};
	}, []);

	if (!projectTemplate) {
		return <LoadingComponent />;
	}
	if (isLoading || isValidating) {
		return <LoadingComponent />;
	}

	return (
		<PlaygroundHost
			template={projectTemplate}
			viewFlags={{ minimal: true, resolution: 'medium' }}
			height={props.height}
		/>
	);
}
