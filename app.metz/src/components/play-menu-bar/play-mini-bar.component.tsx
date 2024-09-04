import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { BiMenu } from 'react-icons/bi';
import { Box, Group, Text, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { SyncManagerState } from '../../state-managers/sync-manager/sync-manager.state';
import { usePlayMenubar } from '../../state-managers/play-menu-bar/play-menu.store';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { EmbedResponse } from '../../repositories/project/use-embed-artifacts.hook';

const syncStatusDetailsMap: {
	[key in SyncManagerState['syncStatus']]: { text: string; color: string };
} = {
	errored: {
		text: 'Syncing failed! Please reload',
		color: 'red',
	},
	synced: {
		text: 'Synced',
		color: 'teal',
	},
	syncing: {
		text: 'Syncing...',
		color: '#666',
	},
	unsynced: {
		text: 'Unsynced',
		color: '#666',
	},
};

const useStyles = createStyles((theme) => ({
	bar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '50px',
	},
}));

export default function (props: { embedResponse: EmbedResponse }) {
	const setState = usePlayMenubar((selector) => selector.setState);
	const router = useRouter();
	const { classes } = useStyles();

	const { project } = props.embedResponse;

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
				<IconHolderComponent iconData={project.project_art} disableClick={true} />
				<Box>
					<Text>{project.name}</Text>
				</Box>
			</Group>
			<Group spacing={'10px'}>
				<IconButtonComponent
					icon={<BiMenu />}
					onClick={() => {
						setState('enlarged');
					}}
				/>
				<DocModalComponent title="Documentation" link="https://docs.metz.sh" />
			</Group>
		</motion.div>
	);
}
