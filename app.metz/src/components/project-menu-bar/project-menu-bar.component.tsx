import { createStyles, CSSObject, LoadingOverlay } from '@mantine/core';
import { motion } from 'framer-motion';
import MiniBarComponent from './mini-bar.component';
import { useProjectMenubar } from '../../state-managers/project-menu-bar/project-menu.store';
import EnlargedBarComponent from './enlarged-bar.component';

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

const minibarStyle: CSSObject = {
	alignSelf: 'center',
	padding: '20px',
	paddingTop: '0px',
	paddingBottom: '0px',
	position: 'absolute',
	top: '7px',
	backgroundColor: 'rgb(12,12,19)',
	border: '1px solid #333',
	borderRadius: '12px',
};

const enlargedBarStyle: CSSObject = {
	...minibarStyle,
	backgroundColor: 'rgb(6,6,12)',
};

const useStyles = createStyles((theme) => ({
	mini: minibarStyle,
	enlarged: enlargedBarStyle,
}));

export default function (props: { id: string }) {
	const { classes } = useStyles();

	const state = useProjectMenubar((selector) => selector.state);
	const isCollapsed = state === 'collapsed';

	return (
		<motion.div
			layout
			transition={{
				duration: 0.1,
				ease: 'circInOut',
			}}
			className={isCollapsed ? classes.mini : classes.enlarged}
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
			{isCollapsed ? (
				<MiniBarComponent id={props.id} />
			) : (
				<EnlargedBarComponent id={props.id} />
			)}
		</motion.div>
	);
}
