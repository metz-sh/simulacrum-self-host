import { Flex, Text, createStyles } from '@mantine/core';
import Image from 'next/image';
import logo from './assets/logo.png';
import { motion, useAnimate } from 'framer-motion';
import { useHover } from '@mantine/hooks';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'start',
		alignItems: 'center',
		gap: '5px',
		cursor: 'pointer',
	},

	name: {
		position: 'relative',
	},

	nameUnderline: {
		position: 'absolute',
		bottom: '4px',
		left: 0,
		right: 0,
		height: '2px',
		background: 'rgb(46,104,230)',
	},
}));

export default function (props: { size: number; title?: string }) {
	const { classes } = useStyles();
	const { ref: hoverRef, hovered } = useHover();
	const [scope, animate] = useAnimate();
	const router = useRouter();

	useEffect(() => {
		if (hovered) {
			animate(
				scope.current,
				{
					width: '100%',
				},
				{
					duration: 0.2,
				}
			);
		} else {
			animate(
				scope.current,
				{
					width: '0%',
				},
				{
					duration: 0.2,
				}
			);
		}
	}, [hovered]);

	return (
		<motion.div
			ref={hoverRef}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 1 }}
			className={classes.container}
			onClick={() => {
				router.push('/');
			}}
		>
			<Image src={logo} height={props.size} width={props.size} alt="logo" />
			<div className={classes.name}>
				<Text ff={'Chakra Petch'} fz={props.size} fw={600} color="rgb(46,104,230)">
					{props.title || 'metz'}
				</Text>
				<motion.div
					initial={{
						width: '0%',
					}}
					transition={{
						duration: '0.005',
					}}
					ref={scope}
					className={classes.nameUnderline}
				/>
			</div>
		</motion.div>
	);
}
