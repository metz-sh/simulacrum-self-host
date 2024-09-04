import { createStyles, LoadingOverlay } from '@mantine/core';
import { motion } from 'framer-motion';
import MiniBarComponent from './play-mini-bar.component';
import EnlargedBarComponent from './play-enlarged-bar.component';
import { usePlayMenubar } from '../../state-managers/play-menu-bar/play-menu.store';
import { EmbedResponse } from '../../repositories/project/use-embed-artifacts.hook';

function Loading() {
	return (
		<LoadingOverlay
			loaderProps={{ size: 'md', color: 'white', variant: 'oval' }}
			visible
			overlayBlur={2}
			overlayColor="rgb(6,6,12)"
		/>
	);
}

const useStyles = createStyles((theme) => ({
	menuBar: {
		alignSelf: 'center',
		marginTop: '5px',
		padding: '20px',
		paddingTop: '10px',
		paddingBottom: '10px',
		position: 'absolute',
		top: '20px',
		backgroundColor: 'rgb(6,6,12)',
		border: '1px solid #333',
		borderRadius: '12px',
	},
}));

export default function (props: { embedResponse: EmbedResponse }) {
	const { classes } = useStyles();

	const state = usePlayMenubar((selector) => selector.state);
	const isCollapsed = state === 'collapsed';

	return (
		<motion.div
			layout
			transition={{
				duration: 0.1,
				ease: 'circInOut',
			}}
			className={classes.menuBar}
			variants={{
				collapsed: {
					transition: {
						delayChildren: 0.1,
					},
				},
				enlarged: {
					transition: {
						delayChildren: 0.1,
					},
				},
			}}
			animate={isCollapsed ? 'collapsed' : 'enlarged'}
		>
			{isCollapsed ? <MiniBarComponent {...props} /> : <EnlargedBarComponent {...props} />}
		</motion.div>
	);
}
