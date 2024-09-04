import { Title, Text, createStyles, Group } from '@mantine/core';
import { FrontMatter } from '../../types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { Project } from '../../repositories/project/models/project.model';
import { openConfirmModal } from '../open-modal/open-confirm-modal';
import { useRestoreDeletedProject } from '../../repositories/project/use-restore-deleted-project.hook';

const useStyles = createStyles(() => ({
	root: {
		backgroundColor: '#131319',
		borderRadius: '10px',
		padding: '20px',
		maxWidth: '425px',

		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignSelf: 'baseline',
	},
	title: {
		color: '#666',
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
	const { trigger: triggerRestore } = useRestoreDeletedProject({
		id: props.project.project_id,
	});
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
				backgroundColor: '#23232f',
			}}
			whileTap={{
				scale: 1.02,
			}}
			onClick={async () => {
				await triggerRestore({});
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
				<Text fz={'md'} fw={400} color="#666" mt={'10px'}>
					{props.project.description}
				</Text>
			</div>

			<div className={classes.titleBottomSection}>
				<Text fz={'xs'} fw={400} color="#666">
					{new Date(props.project.created_at).toDateString()}
				</Text>
			</div>
		</motion.div>
	);
}
