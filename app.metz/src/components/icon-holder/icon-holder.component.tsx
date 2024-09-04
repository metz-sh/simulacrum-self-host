import { Box, ThemeIcon, createStyles } from '@mantine/core';
import { ColorVariantMap } from '../../common/color-variant-map';
import { Icon } from '@iconify/react';

const useStyles = (disableClick?: boolean) =>
	createStyles((theme) => ({
		actionIcon: {
			boxShadow: '2px 0 6px #659aa6, -2px 0 6px #659aa6',
			cursor: disableClick ? 'default' : 'pointer',
		},

		root: {
			display: 'flex',
			justifyContent: 'start',
			alignItems: 'center',
			gap: '15px',
		},
	}))();

export default function (props: {
	iconData: {
		iconString: string;
		iconColorVariant: 'dark' | 'light';
	};
	disableClick?: boolean;
	size?: number;
}) {
	const { classes } = useStyles(props.disableClick);
	return (
		<ThemeIcon
			className={classes.actionIcon}
			style={{
				boxShadow: '1px 0 3px #659aa6, -1px 0 3px #659aa6',
			}}
			variant="filled"
			color={ColorVariantMap[props.iconData.iconColorVariant]}
			size={props.size || 40}
			radius={6}
			p={5}
		>
			<Icon
				icon={props.iconData.iconString}
				fontSize={props.size || 40}
				pointerEvents={'none'}
			/>
		</ThemeIcon>
	);
}
