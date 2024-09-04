import { Box, Tabs } from '@mantine/core';
import { useTabManager } from '../../state-managers/tab-manager/tab-manager.store';
import ProjectsComponent from '../projects/projects.component';
import { TabStates } from './tab-states.enum';
import DeletedProjectsComponent from '../deleted-projects/deleted-projects.component';
import ProjectTemplatesComponent from '../project-templates/project-templates.component';

export default function () {
	const selectedTab = useTabManager((state) => state.selectedTab);
	return (
		<Tabs
			keepMounted={false}
			value={selectedTab}
			styles={{
				root: {
					width: '100%',
					height: '100%',
				},
				panel: {
					height: '100%',
				},
			}}
		>
			<Tabs.Panel value={TabStates.Templates}>
				<ProjectTemplatesComponent />
			</Tabs.Panel>

			<Tabs.Panel value={TabStates.Projects}>
				<ProjectsComponent />
			</Tabs.Panel>

			<Tabs.Panel value={TabStates.DeletedProjects}>
				<DeletedProjectsComponent />
			</Tabs.Panel>
		</Tabs>
	);
}
