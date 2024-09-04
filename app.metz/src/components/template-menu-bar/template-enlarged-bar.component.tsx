import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { Box, Flex, Group, createStyles } from '@mantine/core';
import TextAreaComponent from '../text-area/text-area.component';
import { CgClose } from 'react-icons/cg';
import LoadingComponent from '../loading/loading.component';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { ProjectTemplate } from '../../repositories/project-templates/project-template.model';
import { useTemplateMenubar } from '../../state-managers/template-menu-bar/template-menu.store';
import CreateProjectComponent from '../create-project/create-project.component';

const useStyles = createStyles((theme) => ({
	header: {
		display: 'flex',
		justifyContent: 'end',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '50px',
	},
	root: {
		padding: '5px',
	},
}));

export default function (props: { template: ProjectTemplate }) {
	const { template } = props;

	if (!template) {
		return <LoadingComponent />;
	}

	const setState = useTemplateMenubar((selector) => selector.setState);
	const { classes } = useStyles();

	const nameAndLogo = (
		<Group align="center" pt={30} pb={10}>
			<IconHolderComponent iconData={template.project_art} size={70} />
			<Box>
				<TextAreaComponent
					text={template.name}
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
			text={template.description}
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
					<IconButtonComponent
						minimal
						icon={<CgClose />}
						onClick={() => {
							setState('collapsed');
						}}
					/>
				</Group>
			</Box>
			{nameAndLogo}
			{description}
			<Flex mt={10} justify={'center'} align={'center'} p={5}>
				<CreateProjectComponent templateId={Number(template.id)} />
			</Flex>
		</motion.div>
	);
}
