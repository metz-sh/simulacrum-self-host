import { Box, LoadingOverlay, Text } from '@mantine/core';
import CreateProjectComponent from '../create-project/create-project.component';
import ProjectListComponent from '../project-list/project-list.component';
import { useProjectList } from '../../repositories/project/use-project-list.hook';
import ProjectCardComponent from '../project-card/project-card.component';

import ProjectTemplatesListComponent from '../project-templates-list/project-templates-list.component';
import ProjectTemplateCardComponent from '../project-template-card/project-template-card.component';
import { useProjectTemplatesList } from '../../repositories/project-templates/use-project-templates-list.hook';

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
				<Text color="#777" p={'xs'} fz={'md'}>
					Sorry! Looks like no templates are available right now.
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
	const { data: partialTemplates } = useProjectTemplatesList();
	if (!partialTemplates) {
		return <Loading />;
	}

	if (!partialTemplates.length) {
		return <EmptyState />;
	}

	return (
		<Box>
			<ProjectTemplatesListComponent
				list={partialTemplates.map((partialTemplate) => ({ partialTemplate }))}
				factory={(key, partialTemplate) => {
					return (
						<ProjectTemplateCardComponent key={key} partialTemplate={partialTemplate} />
					);
				}}
			/>
		</Box>
	);
}
