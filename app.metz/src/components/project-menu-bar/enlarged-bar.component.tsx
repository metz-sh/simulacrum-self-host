import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { BiArrowBack } from 'react-icons/bi';
import { Box, Divider, Flex, Group, Kbd, Text, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import { useProjectMenubar } from '../../state-managers/project-menu-bar/project-menu.store';
import TextAreaComponent from '../text-area/text-area.component';
import { useUpdateProject } from '../../repositories/project/use-update-project.hook';
import IconSelectorComponent from '../icon-selector/icon-selector.component';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useProject } from '../../repositories/project/use-project.hook';
import LoadingComponent from '../loading/loading.component';
import DocModalComponent from '../doc-modal/doc-modal.component';
import ButtonComponent from '../button/button.component';
import { MdDeleteForever } from 'react-icons/md';
import { openConfirmModal } from '../open-modal/open-confirm-modal';
import { useDeleteProject } from '../../repositories/project/use-delete-project.hook';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '50px',
	},
	root: {
		padding: '5px',
		width: '100%',
	},
}));

export default function (props: { id: string }) {
	const { data: project } = useProject(props.id);
	const { trigger: triggerUpdate } = useUpdateProject({
		id: props.id,
	});
	const { trigger: triggerDelete } = useDeleteProject({
		id: props.id,
	});

	const setState = useProjectMenubar((selector) => selector.setState);
	const router = useRouter();
	const { classes } = useStyles();

	if (!project) {
		return <LoadingComponent />;
	}

	const nameAndLogo = (
		<Group align="center" pt={10} pb={10}>
			<IconSelectorComponent
				iconData={project.project_art}
				onSelect={(params) => {
					triggerUpdate({
						project_art: params,
					});
				}}
				size={70}
			/>
			<Box>
				<TextAreaComponent
					text={project.name}
					validator={(text) => {
						if (!text) {
							throw new Error(`Project name can't be empty`);
						}
						if (text.length > 30) {
							throw new Error(`That's too long!`);
						}
					}}
					onUpdate={(text) => {
						triggerUpdate({
							name: text,
						});
					}}
					mantineProps={{
						size: 'lg',
						label: 'Name',
						maxRows: 1,
						w: 315,
						bg: '#101016',
						p: '10px',
						style: {
							borderRadius: '8px',
						},
						styles: {
							label: {
								fontSize: '11px',
								color: '#888',
							},
						},
					}}
					errorStyle={{
						fontSize: '10px',
					}}
				/>
			</Box>
		</Group>
	);

	const description = (
		<TextAreaComponent
			text={project.description}
			validator={(text) => {
				if (!text) {
					throw new Error(`Project name can't be empty`);
				}
				if (text.length > 100) {
					throw new Error(`That's too long!`);
				}
			}}
			onUpdate={(text) => {
				triggerUpdate({
					description: text,
				});
			}}
			mantineProps={{
				label: 'Description',
				size: 'md',
				maxRows: 6,
				w: '100%',
				bg: '#101016',
				p: '10px',
				style: {
					borderRadius: '8px',
				},
				styles: {
					label: {
						fontSize: '11px',
						color: '#888',
					},
					input: {
						color: '#999',
					},
				},
				minRows: 4,
			}}
			errorStyle={{
				fontSize: '10px',
			}}
		/>
	);

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: 100,
			}}
			variants={{
				enlarged: {
					opacity: 1,
					y: 0,
				},
			}}
			transition={{
				duration: 0.1,
			}}
			className={classes.root}
		>
			<Flex w={'100%'} justify={'space-between'} align={'center'} mt={10}>
				<Text color="#666">Edit project details</Text>
				<IconButtonComponent
					minimal={true}
					icon={<AiFillCloseCircle size={23} />}
					onClick={() => {
						setState('collapsed');
					}}
				/>
			</Flex>
			{nameAndLogo}
			{description}
			<Divider mt={20} label="Danger Zone" labelPosition="center" color="red" />
			<Flex mt={10} mb={20} p={10} justify={'center'} w={'100%'}>
				<ButtonComponent
					w={'100%'}
					icon={<MdDeleteForever />}
					onClick={() => {
						openConfirmModal({
							title: `Are you sure you want to delete?`,
							children: <Text>Once deleted, embeds will stop working.</Text>,
							async onConfirm() {
								await triggerDelete({});
								setState('collapsed');
								router.push('/');
							},
							size: 'md',
						});
					}}
				>
					Delete project
				</ButtonComponent>
			</Flex>
		</motion.div>
	);
}
