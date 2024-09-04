import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { BiArrowBack } from 'react-icons/bi';
import { Box, Group, Kbd, Text, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import TextAreaComponent from '../text-area/text-area.component';
import { CgClose } from 'react-icons/cg';
import { useProject } from '../../repositories/project/use-project.hook';
import LoadingComponent from '../loading/loading.component';
import { GetEmbedLink } from '../get-embed-link-button/get-embed-link-button.component';
import { usePlayMenubar } from '../../state-managers/play-menu-bar/play-menu.store';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { EmbedResponse } from '../../repositories/project/use-embed-artifacts.hook';

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
	},
}));

export default function (props: { embedResponse: EmbedResponse }) {
	const { project } = props.embedResponse;

	if (!project) {
		return <LoadingComponent />;
	}

	const setState = usePlayMenubar((selector) => selector.setState);
	const { classes } = useStyles();

	const nameAndLogo = (
		<Group align="center" pt={30} pb={10}>
			<IconHolderComponent iconData={project.project_art} size={70} />
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
					onUpdate={(text) => {}}
					mantineProps={{
						size: 'lg',
						label: 'Name',
						maxRows: 1,
						w: 315,
						bg: 'rgb(9,9,14)',
						p: '10px',
						style: {
							borderRadius: '8px',
						},
						disabled: true,
						styles: {
							label: {
								fontSize: '11px',
								color: '#888',
							},
							input: {
								'&[data-disabled]': {
									backgroundColor: 'inherit',
									color: 'inherit',
									opacity: 'inherit',
									cursor: 'inherit',
								},
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
			onUpdate={(text) => {}}
			mantineProps={{
				label: 'Description',
				size: 'md',
				maxRows: 6,
				w: '100%',
				bg: 'rgb(9,9,14)',
				p: '10px',
				style: {
					borderRadius: '8px',
				},
				disabled: true,
				styles: {
					label: {
						fontSize: '11px',
						color: '#888',
					},
					input: {
						color: '#999',
						'&[data-disabled]': {
							backgroundColor: 'inherit',
							color: 'inherit',
							opacity: 'inherit',
							cursor: 'inherit',
						},
					},
				},
				minRows: 4,
			}}
			errorStyle={{
				fontSize: '10px',
			}}
		/>
	);

	const updatedAt = new Date(project.project_artifacts.updatedAt);
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
			<Box className={classes.header}>
				<Group spacing={'10px'}>
					<DocModalComponent title="Documentation" link="https://docs.metz.sh" />
					<IconButtonComponent
						icon={<CgClose />}
						onClick={() => {
							setState('collapsed');
						}}
					/>
				</Group>
			</Box>
			{nameAndLogo}
			{description}
			<Group mt={20} position="left" spacing={'4px'}>
				<Text fz={'12px'} color={'#777'}>
					Updated at:
				</Text>
				<Text fz={'12px'} color={'#ccc'}>
					{`${updatedAt.toLocaleString()}`}
				</Text>
			</Group>
		</motion.div>
	);
}
