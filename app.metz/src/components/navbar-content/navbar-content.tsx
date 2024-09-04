import { Box, Text, ThemeIcon, createStyles } from '@mantine/core';
import BoxHolder from '../box-holder';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from './header-assets/logo.png';
import NavbarMenuItemsComponent from './navbar-menu-items.component';
import MetzBannerComponent from '../metz-banner/metz-banner.component';

const useStyles = createStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
		padding: '10px',
	},
	nameLogo: {
		height: '20%',
	},
	content: {
		height: '70%',
	},
	userCard: {
		height: '10%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'end',
	},
}));

export default function (props: {}) {
	const { classes } = useStyles();

	return (
		<Box className={classes.root}>
			<Box className={classes.nameLogo}>
				<Box p={10}>
					<MetzBannerComponent size={36} />
				</Box>
			</Box>
			<Box className={classes.content}>
				<NavbarMenuItemsComponent />
			</Box>
		</Box>
	);
}
