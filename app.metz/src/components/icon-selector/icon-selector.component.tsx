import { Popover } from '@mantine/core';
import { motion } from 'framer-motion';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { useEffect, useState } from 'react';
import IconSearchComponent from '../icon-search/icon-search.component';

export default function (props: {
	iconData: {
		iconString: string;
		iconColorVariant: 'dark' | 'light';
	};
	onSelect: (iconData: { iconString: string; iconColorVariant: 'dark' | 'light' }) => void;
	size?: number;
}) {
	const [iconData, setIconData] = useState(() => props.iconData);
	useEffect(() => {
		setIconData(props.iconData);
	}, [props.iconData]);
	return (
		<Popover position="top-start" withArrow offset={20} shadow="md">
			<Popover.Target>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '5px',
					}}
				>
					<motion.div
						style={{
							display: 'flex',
							justifyContent: 'end',
						}}
						whileHover={{
							scale: 1.05,
							y: '-2px',
						}}
						whileTap={{
							scale: 1.02,
							y: '2px',
						}}
						transition={{
							duration: 0.1,
						}}
					>
						<IconHolderComponent iconData={iconData} size={props.size} />
					</motion.div>
				</div>
			</Popover.Target>
			<Popover.Dropdown
				style={{
					backgroundColor: 'rgb(6,6,12)',
				}}
			>
				<IconSearchComponent
					iconData={props.iconData}
					onSelect={(iconData) => {
						if (!iconData) {
							iconData = {
								iconString: 'mdi:null-off',
								iconColorVariant: 'dark',
							};
						}
						setIconData(iconData);
						props.onSelect(iconData);
					}}
				/>
			</Popover.Dropdown>
		</Popover>
	);
}
