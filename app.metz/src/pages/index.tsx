import { Box } from '@mantine/core';
import NavbarComponent from '../components/navbar/navbar.component';
import HeaderComponent from '../components/header/header.component';
import TabManagerComponent from '../components/tab-manager/tab-manager.component';
import AppHolderComponent from '../components/app-holder/app-holder.component';

export default function Home() {
	return (
		<AppHolderComponent navbar={<NavbarComponent />} header={<HeaderComponent />}>
			<Box w={'100%'} h={'100%'}>
				<TabManagerComponent />
			</Box>
		</AppHolderComponent>
	);
}
