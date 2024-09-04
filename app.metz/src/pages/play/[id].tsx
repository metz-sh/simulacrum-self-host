import dynamic from 'next/dynamic';
const Playground = dynamic(
	import('@metz/simulacrum').then((p) => p.Playground),
	{ ssr: false }
);
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { themeOverride } from '../_app';
import { Box } from '@mantine/core';
import { Project } from '../../repositories/project/models/project.model';
import LoadingComponent from '../../components/loading/loading.component';
import { createSyncManager } from '../../state-managers/sync-manager/sync-manager.store';
import {
	EmbedResponse,
	useEmbedArtifacts,
} from '../../repositories/project/use-embed-artifacts.hook';
import PlayMenuBarComponent from '../../components/play-menu-bar/play-menu-bar.component';
import { PlaygroundViewFlags } from '@metz/simulacrum/dist/types';

const PlaygroundHost = memo(function (props: {
	embedResponse: EmbedResponse;
	viewFlags: PlaygroundViewFlags;
}) {
	const {
		project: { project_id, project_artifacts },
	} = props.embedResponse;
	const projectName = `project_${project_id}`;

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
						height: '100vh',
					}}
				>
					<Playground
						projectName={projectName}
						display={project_artifacts.display}
						height="100vh"
						build={project_artifacts.build}
						storySetups={project_artifacts.storySetups as [any, ...any[]]}
						enableModalProvider
						viewFlags={props.viewFlags}
					/>
				</div>
				{!props.viewFlags.minimal && (
					<PlayMenuBarComponent embedResponse={props.embedResponse} />
				)}
			</Box>
		</div>
	);
});

function PlaygroundProvider(props: { code: string; viewFlags: PlaygroundViewFlags }) {
	const { data: embedResponse, isLoading, isValidating, mutate } = useEmbedArtifacts(props.code);

	useEffect(() => {
		return () => {
			mutate(undefined);
		};
	}, []);

	if (!embedResponse) {
		return <LoadingComponent />;
	}
	if (!embedResponse.project.project_artifacts.project) {
		throw new Error('The project content is malformed!');
	}
	if (isLoading || isValidating) {
		return <LoadingComponent />;
	}

	return <PlaygroundHost embedResponse={embedResponse} viewFlags={props.viewFlags} />;
}

export default function () {
	const pathName = usePathname();
	if (!pathName) {
		return <LoadingComponent />;
	}
	const code = pathName.split('/play/')[1];
	const searchParams = useSearchParams();
	return <PlaygroundProvider code={code} viewFlags={buildFlags(searchParams)} />;
}

function buildFlags(params: ReadonlyURLSearchParams): PlaygroundViewFlags {
	const minimal = params.get('minimal');
	const parsedMinimal = minimal ? new Boolean(minimal).valueOf() : false;
	const resolution = params.get('resolution') as PlaygroundViewFlags['resolution'];
	return {
		minimal: parsedMinimal,
		resolution,
	};
}
