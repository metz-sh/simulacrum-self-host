import { Navbar, createStyles } from '@mantine/core';
import NavbarContent from '../navbar-content/navbar-content';

const useStyles = createStyles((theme) => ({
	navbar: {
		backgroundColor: 'inherit',
		height: '100%',
	},
}));

export default function () {
	const { classes, theme } = useStyles();
	return (
		<Navbar p="md" width={{ sm: 200, lg: 300 }} className={classes.navbar}>
			<NavbarContent />
		</Navbar>
	);
}
