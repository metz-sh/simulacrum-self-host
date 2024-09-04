import { Title, Text, createStyles, Group } from '@mantine/core';
import { FrontMatter } from '../../types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { Project } from '../../repositories/project/models/project.model';

const useStyles = createStyles(() => ({
	root: {
		backgroundColor: '#2620b9',
		borderRadius: '10px',
		padding: '20px',
		maxWidth: '425px',

		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignSelf: 'baseline',
	},
	title: {
		color: '#75c2de',
	},
	titleBottomSection: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: '30px',
	},
}));

export default function (props: { project: Project; path: string }) {
	const router = useRouter();
	const { classes } = useStyles();
	return (
		<motion.div
			className={classes.root}
			layout
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			whileHover={{
				scale: 1.05,
				cursor: 'pointer',
				backgroundColor: '#5954cb',
			}}
			whileTap={{
				scale: 1.02,
			}}
			onClick={() => {
				router.push(props.path);
			}}
		>
			<div>
				<Group position="apart">
					<Title order={3} className={classes.title} maw={310}>
						{props.project.name}
					</Title>
					<IconHolderComponent iconData={props.project.project_art} />
				</Group>
				<Text fz={'md'} fw={400} color="#afddff" mt={'10px'}>
					{props.project.description}
				</Text>
			</div>

			<div className={classes.titleBottomSection}>
				<Text fz={'xs'} fw={400} color="#afddff">
					{new Date(props.project.created_at).toDateString()}
				</Text>
			</div>
		</motion.div>
	);
}
