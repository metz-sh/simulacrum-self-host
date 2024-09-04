import { Container, SimpleGrid, createStyles } from '@mantine/core';
import { motion } from 'framer-motion';
import { ProjectTemplateWithoutArtifacts } from '../../repositories/project-templates/project-template.model';

function renderArticleList(
	templates: {
		partialTemplate: ProjectTemplateWithoutArtifacts;
	}[],
	factory: (
		key: number | string,
		partialTemplate: ProjectTemplateWithoutArtifacts
	) => React.ReactNode
) {
	return templates.map((data, index) => {
		return factory(index, data.partialTemplate);
	});
}

export default function (props: {
	list: {
		partialTemplate: ProjectTemplateWithoutArtifacts;
	}[];
	factory: (
		key: number | string,
		partialTemplate: ProjectTemplateWithoutArtifacts
	) => React.ReactNode;
}) {
	return (
		<>
			<Container pb={90}>
				<motion.div layout>
					<SimpleGrid
						breakpoints={[
							{
								minWidth: 'sm',
								cols: 2,
							},
						]}
						cols={1}
						spacing={'5rem'}
					>
						{renderArticleList(props.list, props.factory)}
					</SimpleGrid>
				</motion.div>
			</Container>
		</>
	);
}
