import { Box, LoadingOverlay, Text } from '@mantine/core';
import CreateProjectComponent from '../create-project/create-project.component';
import ProjectListComponent from '../project-list/project-list.component';
import { useProjectList } from '../../repositories/project/use-project-list.hook';
import ProjectCardComponent from '../project-card/project-card.component';
import DeletedProjectCardComponent from '../deleted-project-card/deleted-project-card.component';
import { useDeletedProjectList } from '../../repositories/project/use-deleted-project-list.hook';

function EmptyState() {
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					border: '2px dashed #333',
					width: '80%',
					height: '250px',
					borderRadius: '10px',
				}}
			>
				<Text color="#ccc" p={'xs'} fz={'xl'}>
					Deleted projects will appear here
				</Text>
				<Text color="#777" p={'xs'} fz={'md'}>
					Click on them to restore and resume working!
				</Text>
			</div>
		</Box>
	);
}

function Loading() {
	return (
		<LoadingOverlay
			loaderProps={{ size: 'md', color: 'white', variant: 'oval' }}
			visible
			overlayColor="#000"
		/>
	);
}

export default function () {
	const { data: projects } = useDeletedProjectList();

	if (!projects) {
		return <Loading />;
	}

	if (!projects.length) {
		return <EmptyState />;
	}

	const projectList = projects.map((project) => ({
		project,
		path: `/project/${project.project_id}`,
	}));
	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					marginBottom: '80px',
				}}
			>
				<Box mih={'36px'} mah={'36px'}>
					<Text fz={16} color="#75c2dec9">
						Tapping will restore a deleted project, and you can resume your work
					</Text>
				</Box>
			</Box>
			<ProjectListComponent
				list={projectList}
				factory={(key, project, path) => {
					return <DeletedProjectCardComponent key={key} project={project} path={path} />;
				}}
			/>
		</Box>
	);
}
