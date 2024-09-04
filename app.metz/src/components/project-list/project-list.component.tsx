import { Container, SimpleGrid, createStyles } from '@mantine/core';
import { type FrontMatter } from '../../types';
import styles from './article-list.module.css';
import { Timeline, Text } from '@mantine/core';
import {
	IconGitBranch,
	IconGitPullRequest,
	IconGitCommit,
	IconMessageDots,
} from '@tabler/icons-react';
import { NextRouter, useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ProjectCardComponent from '../project-card/project-card.component';
import { Project } from '../../repositories/project/models/project.model';

function renderArticleList(
	projects: {
		project: Project;
		path: string;
	}[],
	factory: (key: number | string, project: Project, path: string) => React.ReactNode
) {
	return projects.map((data, index) => {
		return factory(index, data.project, data.path);
	});
}

export default function (props: {
	list: {
		project: Project;
		path: string;
	}[];
	factory: (key: number | string, project: Project, path: string) => React.ReactNode;
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
