import { Header, createStyles } from '@mantine/core';
import JoinSlack from '../join-slack/join-slack';

const useStyles = createStyles((theme) => ({
	menuBar: {
		display: 'flex',
		justifyContent: 'end',
		alignItems: 'center',
		gap: '10px',
	},
	header: {
		backgroundColor: 'inherit',
	},
}));

export default function () {
	const { classes, theme } = useStyles();
	return (
		<Header height={{ base: 50, md: 70 }} p="md" className={classes.header}>
			<div className={classes.menuBar}>
				<JoinSlack minimal />
			</div>
		</Header>
	);
}
