import { Box, createStyles, CSSObject, LoadingOverlay } from '@mantine/core';
import { motion } from 'framer-motion';
import MiniBarComponent from './mini-bar.component';
import {
	ProjectTemplate,
	ProjectTemplateWithoutArtifacts,
} from '../../repositories/project-templates/project-template.model';

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
	padding: '5px',
	paddingTop: '0px',
	paddingBottom: '0px',
	position: 'absolute',
	top: '11px',
	// backgroundColor: 'rgb(12,12,19)',
	border: 'none',
	borderRadius: '12px',
	width: '33%',
};

const enlargedBarStyle: CSSObject = {
	...minibarStyle,
	backgroundColor: 'rgb(6,6,12)',
};

const useStyles = createStyles((theme) => ({
	mini: minibarStyle,
	enlarged: enlargedBarStyle,
}));

export default function (props: {
	template: ProjectTemplate;
	templates: ProjectTemplateWithoutArtifacts[];
}) {
	const { classes } = useStyles();

	return (
		<Box className={classes.mini}>
			<MiniBarComponent {...props} />
		</Box>
	);
}
