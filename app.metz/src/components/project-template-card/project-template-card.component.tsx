import { Group, Text, Title, createStyles } from '@mantine/core';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ProjectTemplateWithoutArtifacts } from '../../repositories/project-templates/project-template.model';
import IconHolderComponent from '../icon-holder/icon-holder.component';

const useStyles = createStyles(() => ({
	root: {
		backgroundColor: '#000',
		borderRadius: '10px',
		padding: '20px',
		maxWidth: '425px',
		border: '2px #222 dashed',
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
		color: '#d6bf88',
	},
}));

export default function (props: { partialTemplate: ProjectTemplateWithoutArtifacts }) {
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
				backgroundColor: '#10101b',
			}}
			whileTap={{
				scale: 1.02,
			}}
			onClick={() => {
				router.push(`/template/${props.partialTemplate.id}`);
			}}
		>
			<div>
				<Group position="apart">
					<Title order={3} className={classes.title} maw={310}>
						{props.partialTemplate.name}
					</Title>
					<IconHolderComponent iconData={props.partialTemplate.project_art} />
				</Group>
				<Text fz={'md'} fw={400} mt={'20px'} color="#999">
					{props.partialTemplate.description}
				</Text>
			</div>
		</motion.div>
	);
}
