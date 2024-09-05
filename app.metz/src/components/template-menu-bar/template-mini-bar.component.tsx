import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { RiCodeSSlashFill } from 'react-icons/ri';
import { Box, Group, createStyles, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { ProjectTemplate } from '../../repositories/project-templates/project-template.model';
import { useTemplateMenubar } from '../../state-managers/template-menu-bar/template-menu.store';
import CreateProjectComponent from '../create-project/create-project.component';
import MinimalCreateProjectComponent from '../create-project/minimal-create-project.component';

const useStyles = createStyles((theme) => ({
	bar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '50px',
	},
}));

export default function (props: { template: ProjectTemplate }) {
	const { template } = props;
	const setState = useTemplateMenubar((selector) => selector.setState);
	const router = useRouter();
	const { classes } = useStyles();

	return (
		<motion.div
			initial={{
				opacity: 0,
			}}
			variants={{
				collapsed: {
					opacity: 1,
				},
			}}
			transition={{
				duration: 0.1,
			}}
			className={classes.bar}
		>
			<Group align="center" position="center">
				<IconHolderComponent iconData={template.project_art} disableClick={true} />
				<Box>
					<Text color="#75c2de">{template.name}</Text>
				</Box>
			</Group>
			<Group spacing={'10px'}>
				<MinimalCreateProjectComponent templateId={template.id} newTab={true} />
			</Group>
		</motion.div>
	);
}
