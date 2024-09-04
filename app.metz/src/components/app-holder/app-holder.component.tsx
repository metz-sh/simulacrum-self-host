import { Box, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
	root: {
		display: 'flex',
		width: '100vw',
		height: '100vh',
	},
	navbar: {},
	header: {},
	footer: {},
	layout: {
		width: '100%',
	},
	main: {
		height: 'calc(100vh - var(--mantine-header-height, 0px))',
		overflow: 'auto',
		padding: '30px',
	},
}));

export default function (props: {
	navbar: React.ReactNode;
	header: React.ReactNode;
	children: React.ReactNode;
}) {
	const { classes, theme } = useStyles();
	return (
		<Box className={classes.root}>
			<Box className={classes.navbar}>{props.navbar}</Box>
			<Box className={classes.layout}>
				<Box className={classes.header}>{props.header}</Box>
				<Box className={classes.main}>{props.children}</Box>
			</Box>
		</Box>
	);
}
