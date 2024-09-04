import { Box, LoadingOverlay, Text } from '@mantine/core';
import CreateProjectComponent from '../create-project/create-project.component';
import ProjectListComponent from '../project-list/project-list.component';
import { useProjectList } from '../../repositories/project/use-project-list.hook';
import ProjectCardComponent from '../project-card/project-card.component';

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
					Your projects will appear here
				</Text>
				<Text color="#777" p={'xs'} fz={'md'}>
					After creating one, publish it and you will see it in the Discover tab!
				</Text>
				<Box p={'xl'}>
					<CreateProjectComponent title="Create Blank Project" />
				</Box>
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
	const { data: projects } = useProjectList();

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
					justifyContent: 'end',
					marginBottom: '80px',
				}}
			>
				<CreateProjectComponent title="Create Blank Project" />
			</Box>
			<ProjectListComponent
				list={projectList}
				factory={(key, project, path) => {
					return <ProjectCardComponent key={key} project={project} path={path} />;
				}}
			/>
		</Box>
	);
}
