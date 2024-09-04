import { Group, ThemeIcon, Text, Box, createStyles, Divider } from '@mantine/core';
import { FaOldRepublic } from 'react-icons/fa';
import { FiFolder } from 'react-icons/fi';
import ItemComponent from '../item/item.component';
import { CgDebug } from 'react-icons/cg';
import { BiBookmark, BiBulb, BiGlobe } from 'react-icons/bi';
import { useTabManager } from '../../state-managers/tab-manager/tab-manager.store';
import { TabStates } from '../tab-manager/tab-states.enum';
import { MdRestoreFromTrash } from 'react-icons/md';

const useStyles = createStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		gap: '20px',
	},
}));

function Item(props: {
	id: TabStates;
	title: string;
	description: string;
	icon: React.ReactNode;
	iconBackgroundColor?: string;
}) {
	const { selectedTab, setSelectedTab } = useTabManager((state) => ({
		selectedTab: state.selectedTab,
		setSelectedTab: state.setSelectedTab,
	}));
	const isActive = props.id === selectedTab;
	return (
		<ItemComponent
			isActive={isActive}
			onClick={() => {
				setSelectedTab(props.id);
			}}
		>
			<Group position="left" w={'100%'}>
				<ThemeIcon
					variant="filled"
					size={40}
					radius={10}
					p={5}
					color={props.iconBackgroundColor || 'rgba(37,39,48,0.4)'}
				>
					{props.icon}
				</ThemeIcon>
				<div>
					<Text lineClamp={1} fw={600} fz={'lg'} ff={'Space Grotesk'}>
						{props.title}
					</Text>
					<Text size="xs" color="dimmed">
						{props.description}
					</Text>
				</div>
			</Group>
		</ItemComponent>
	);
}

export default function () {
	const { classes } = useStyles();
	return (
		<Box className={classes.root}>
			<Item
				id={TabStates.Templates}
				title="Templates"
				description="Recipes, ready to cook!"
				icon={<BiGlobe size={20} color="#113afc" />}
				iconBackgroundColor="#E5E4E2"
			/>
			<Divider />
			<Item
				id={TabStates.Projects}
				title="Projects"
				description="See all your work"
				icon={<FiFolder size={20} color="#00a2dd" />}
			/>
			<Item
				id={TabStates.DeletedProjects}
				title="Deleted projects"
				description="Restore stuff that got deleted"
				icon={<MdRestoreFromTrash size={20} color="#00a2dd" />}
			/>
		</Box>
	);
}
