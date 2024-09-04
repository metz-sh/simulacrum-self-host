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
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import LoadingComponent from '../../components/loading/loading.component';
import TemplateMenuBarComponent from '../../components/template-menu-bar/template-menu-bar.component';
import MetzBannerComponent from '../../components/metz-banner/metz-banner.component';

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
				<TemplateMenuBarComponent template={props.template} />
				<Box
					sx={{
						alignSelf: 'start',
						position: 'absolute',
						top: '20px',
						left: '20px',
					}}
				>
					<MetzBannerComponent size={30} />
				</Box>
			</Box>
		</div>
	);
});

function TemplateProvider(props: { templateId: number; height: string }) {
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
			viewFlags={{ minimal: true }}
			height={props.height}
		/>
	);
}

export default function () {
	const pathName = usePathname();
	if (!pathName) {
		return <LoadingComponent />;
	}
	const templateId = Number(pathName.split('/template/')[1]);
	return <TemplateProvider templateId={templateId} height="100vh" />;
}
