import dynamic from 'next/dynamic';
const Editor = dynamic(
	import('@metz/simulacrum').then((p) => p.Editor),
	{ ssr: false }
);
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { themeOverride } from '../_app';
import { Box, Flex } from '@mantine/core';
import { Project } from '../../repositories/project/models/project.model';
import ProjectMenuBarComponent from '../../components/project-menu-bar/project-menu-bar.component';
import { useProjectArtifacts } from '../../repositories/project/use-project-artifacts.hook';
import LoadingComponent from '../../components/loading/loading.component';
import {
	SyncManagerContext,
	createSyncManager,
} from '../../state-managers/sync-manager/sync-manager.store';
import { BehaviorSubject } from 'rxjs';
import { SyncManagerState } from '../../state-managers/sync-manager/sync-manager.state';
import IconButtonComponent from '../../components/icon-button/icon-button.component';
import { BiArrowBack } from 'react-icons/bi';
import DocModalComponent from '../../components/doc-modal/doc-modal.component';
import ProjectEditorHeaderComponent from '../../components/project-editor-header/project-editor-header.component';

const HEADER_HEIGHT = 53;

const EditorHost = memo(function (props: {
	projectId: string;
	projectName: string;
	project_artifacts: Project['project_artifacts'];
	serverSequence: number;
}) {
	const [syncManager] = useState(() => createSyncManager());

	useEffect(() => {
		const syncManagerState$ = new BehaviorSubject<SyncManagerState>(syncManager.getState());
		syncManager.subscribe((state) => syncManagerState$.next(state));
	}, []);

	useEffect(() => {
		syncManager.getState().setServerSequence(props.serverSequence);
	}, [syncManager, props.serverSequence]);

	useEffect(() => {
		return syncManager.getState().cancelSubscriptions;
	}, []);

	const isSyncingAllowed = syncManager((state) => state.isSyncingAllowed);

	if (!isSyncingAllowed) {
		throw new Error('Syncing has encountered an error. Please reload!');
	}

	const { projectName, project_artifacts } = props;
	return (
		<SyncManagerContext.Provider value={syncManager}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<div
					style={{
						height: `calc(100vh - ${HEADER_HEIGHT}px)`,
					}}
				>
					<ProjectEditorHeaderComponent height={`${HEADER_HEIGHT}px`} />
					<Editor
						project={project_artifacts.project}
						projectName={projectName}
						display={project_artifacts.display}
						height={`calc(100vh - ${HEADER_HEIGHT - 3}px)`}
						storySetups={project_artifacts.storySetups}
						notesContent={project_artifacts.notes?.notesContent}
						onMount={({ analyticsObservable, stateChangeObservable }) => {
							syncManager
								.getState()
								.setEventSource(
									props.projectId,
									stateChangeObservable,
									syncManager
								);
						}}
						enableModalProvider
					/>
				</div>
				<ProjectMenuBarComponent id={props.projectId} />
			</Box>
		</SyncManagerContext.Provider>
	);
});

function EditorWrapper(props: { id: string }) {
	const { data: partialProject, isLoading, isValidating, mutate } = useProjectArtifacts(props.id);

	useEffect(() => {
		return () => {
			mutate(undefined);
		};
	}, []);

	if (!partialProject) {
		return <LoadingComponent />;
	}
	if (!partialProject.project_artifacts.project) {
		throw new Error('The project content is malformed!');
	}
	if (isLoading || isValidating) {
		return <LoadingComponent />;
	}

	return (
		<EditorHost
			projectId={props.id}
			projectName={`project_${partialProject.project_id}`}
			project_artifacts={partialProject.project_artifacts}
			serverSequence={partialProject.server_sequence}
		/>
	);
}

export default function () {
	const pathName = usePathname();
	if (!pathName) {
		return <LoadingComponent />;
	}
	const id = pathName.split('/project/')[1];
	return <EditorWrapper id={id} />;
}
