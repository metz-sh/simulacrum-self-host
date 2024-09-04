import { MotionStyle, Variant, motion } from 'framer-motion';
import { Ref, forwardRef } from 'react';

const variants: { [key: string]: Variant } = {
	inactive: {
		backgroundColor: 'rgb(6,6,12)',
	},
	active: {
		backgroundColor: 'rgba(37,39,48,0.4)',
	},
};

export default forwardRef(function (
	props: {
		children: React.ReactNode;
		isActive?: boolean;
		onClick?: () => void;
	},
	ref: Ref<HTMLDivElement>
) {
	const activeVariant = props.isActive ? 'active' : 'inactive';
	return (
		<motion.div
			ref={ref}
			variants={variants}
			animate={activeVariant}
			style={{
				width: '100%',
				padding: '10px',
				borderRadius: '10px',
				cursor: 'pointer',
			}}
			whileHover={{
				backgroundColor: 'rgba(37,39,48,0.7)',
			}}
			transition={{
				duration: 0.125,
			}}
			onClick={props.onClick}
		>
			{props.children}
		</motion.div>
	);
});
