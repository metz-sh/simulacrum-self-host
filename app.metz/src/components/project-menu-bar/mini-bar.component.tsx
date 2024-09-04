import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { BiArrowBack, BiMenu } from 'react-icons/bi';
import { Box, Divider, Group, Text, ThemeIcon, createStyles } from '@mantine/core';
import { FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { Project } from '../../repositories/project/models/project.model';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { useProjectMenubar } from '../../state-managers/project-menu-bar/project-menu.store';
import { useUpdateProject } from '../../repositories/project/use-update-project.hook';
import { useProject } from '../../repositories/project/use-project.hook';
import LoadingComponent from '../loading/loading.component';
import { SyncManagerState } from '../../state-managers/sync-manager/sync-manager.state';
import { useSyncManager } from '../../state-managers/sync-manager/sync-manager.store';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { MdSettings } from 'react-icons/md';
import { GetEmbedLink } from '../get-embed-link-button/get-embed-link-button.component';
import { GetEmbedLinkIcon } from '../get-embed-link-button/get-embed-link-icon-button.component';
import {
	BsCloud,
	BsCloudArrowUpFill,
	BsFillCloudCheckFill,
	BsFillCloudSlashFill,
} from 'react-icons/bs';
import TipComponent from '../tip/tip.component';

function createSyncIcon(params: { tooltipText: string; icon: React.ReactNode }) {
	return (
		<TipComponent text={params.tooltipText}>
			<ThemeIcon color="inherit">{params.icon}</ThemeIcon>
		</TipComponent>
	);
}

const syncStatusDetailsMap: { [key in SyncManagerState['syncStatus']]: React.ReactNode } = {
	errored: createSyncIcon({
		tooltipText: "Couldn't save! Please reload",
		icon: <BsFillCloudSlashFill size={20} color="red" />,
	}),
	synced: createSyncIcon({
		tooltipText: 'Saved successfully!',
		icon: <BsFillCloudCheckFill size={20} color="teal" />,
	}),
	syncing: createSyncIcon({
		tooltipText: 'Saving...',
		icon: <BsCloudArrowUpFill size={20} color="orange" />,
	}),
	unsynced: createSyncIcon({
		tooltipText: 'Unsaved work, you can wait for autosave or do it manually!',
		icon: <BsCloud size={20} />,
	}),
};

const useStyles = createStyles((theme) => ({
	bar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '20px',
		minHeight: '35px',
		maxHeight: '35px',
	},
}));

export default function (props: { id: string }) {
	const setState = useProjectMenubar((selector) => selector.setState);
	const { classes } = useStyles();

	const { data: project } = useProject(props.id);
	const syncIcon = syncStatusDetailsMap[useSyncManager((selector) => selector.syncStatus)];

	if (!project) {
		return <LoadingComponent />;
	}

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
			<Text>{project.name}</Text>
			{syncIcon}
			<Divider orientation="vertical" />
			<Group spacing={10}>
				<IconButtonComponent
					icon={<MdSettings size={20} />}
					minimal={true}
					onClick={() => {
						setState('enlarged');
					}}
				/>
				<DocModalComponent minimal={true} link="https://docs.metz.sh" />
				<GetEmbedLinkIcon projectId={props.id} text="Copy embed link" />
			</Group>
		</motion.div>
	);
}
