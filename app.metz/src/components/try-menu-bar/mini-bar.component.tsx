import { motion } from 'framer-motion';
import IconButtonComponent from '../icon-button/icon-button.component';
import { BiArrowBack, BiMenu } from 'react-icons/bi';
import { Box, Divider, Flex, Group, Select, Text, ThemeIcon, createStyles } from '@mantine/core';
import { FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { Project } from '../../repositories/project/models/project.model';
import IconHolderComponent from '../icon-holder/icon-holder.component';
import { useProjectMenubar } from '../../state-managers/project-menu-bar/project-menu.store';
import { useUpdateProject } from '../../repositories/project/use-update-project.hook';
import { useProject } from '../../repositories/project/use-project.hook';
import LoadingComponent from '../loading/loading.component';
import { SyncManagerState } from '../../state-managers/sync-manager/sync-manager.state';
import { useSyncManager } from '../../state-managers/sync-manager/sync-manager.store';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { MdSettings } from 'react-icons/md';
import { GetEmbedLink } from '../get-embed-link-button/get-embed-link-button.component';
import { GetEmbedLinkIcon } from '../get-embed-link-button/get-embed-link-icon-button.component';
import {
	BsCloud,
	BsCloudArrowUpFill,
	BsFillCloudCheckFill,
	BsFillCloudSlashFill,
} from 'react-icons/bs';
import TipComponent from '../tip/tip.component';
import {
	ProjectTemplate,
	ProjectTemplateWithoutArtifacts,
} from '../../repositories/project-templates/project-template.model';
import { template } from 'lodash';
import { FaHome } from 'react-icons/fa';

const useStyles = createStyles((theme) => ({
	bar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'center',
		gap: '20px',
		minHeight: '35px',
		width: '100%',
		// maxHeight: '53px',
	},
}));

export default function (props: {
	template: ProjectTemplate;
	templates: ProjectTemplateWithoutArtifacts[];
}) {
	const router = useRouter();
	const { classes } = useStyles();
	const data = props.templates.map((t) => ({ label: t.name, value: t.id.toString() }));
	return (
		<Box className={classes.bar}>
			<Box pt={4} pb={4} w={'100%'}>
				<Select
					p={0}
					// w={'100%'}
					size="sm"
					data={data}
					value={props.template.id.toString()}
					styles={{
						input: {
							backgroundColor: 'rgb(12,12,19)',
							color: '#75c2de',
							// border: 'none',
							// padding: 0,
							textAlign: 'center',
						},
						rightSection: {},
					}}
					onChange={(change) => {
						if (!change) {
							return;
						}

						router.push(`/try?templateId=${change}`);
					}}
				/>
			</Box>
			<Flex gap={10}>
				<DocModalComponent minimal={true} link="https://docs.metz.sh" />
				<IconButtonComponent
					minimal
					icon={<FaHome size={20} />}
					onClick={() => {
						window.open('https://metz.sh', '_blank');
					}}
				/>
			</Flex>
		</Box>
	);
}
