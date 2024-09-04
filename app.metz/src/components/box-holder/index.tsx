import { createStyles } from '@mantine/core';
import Box from '../box';

function createBoxes(depth: number) {
	if (depth === 1) {
		return <Box id={`box_${depth}`} size={5} animate></Box>;
	}
	const size = (depth - 1) * 20;
	// eslint-disable-next-line
	return <Box animate id={`box_${depth}`} size={size} children={createBoxes(depth - 1)} />;
}

const useStyles = (isClickable?: boolean) => {
	return createStyles(() => ({
		button: {
			borderRadius: '10%',
			'&:hover': {
				cursor: isClickable ? 'pointer' : 'inherit',
				...(isClickable
					? {
							backgroundColor: 'white',
							div: {
								borderColor: 'black',
							},
						}
					: {}),
			},
			'&:active': {
				cursor: isClickable ? 'pointer' : 'inherit',

				...(isClickable
					? {
							backgroundColor: 'white',
							div: {
								borderColor: 'black',
							},
							transform: 'translate(0px, 2px)',
						}
					: {}),
			},
		},
	}));
};

export default function (props: { depth: number; onClick?: () => void }) {
	if (props.depth < 2) {
		throw new Error('depth must at least be 2!');
	}
	const { classes } = useStyles(!!props.onClick)();
	return (
		<>
			<div onClick={props.onClick} className={classes.button}>
				<Box id="box_boundary" size={(props.depth - 1) * 20}>
					{createBoxes(props.depth - 1)}
				</Box>
			</div>
		</>
	);
}
