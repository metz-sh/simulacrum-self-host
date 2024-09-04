import { Box, Flex, Popover } from '@mantine/core';
import IconButtonComponent from '../icon-button/icon-button.component';
import DocModalComponent from '../doc-modal/doc-modal.component';
import { BiArrowBack, BiSolidHome, BiSolidMessage, BiSolidMessageError } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { MdHomeFilled } from 'react-icons/md';
import logo from '../navbar-content/header-assets/logo.png';
import Image from 'next/image';
import MetzBannerComponent from '../metz-banner/metz-banner.component';
import { TbMessageReport } from 'react-icons/tb';
import JoinSlack from '../join-slack/join-slack';

function SupportButton() {
	return <JoinSlack minimal />;
}

export default function (props: {
	height: string;
	bannerTitle?: string;
	rightSection?: React.ReactNode;
}) {
	return (
		<Flex
			h={props.height}
			w={'100%'}
			bg={'rgb(6,6,12)'}
			pl={'15px'}
			pr={'15px'}
			display={'flex'}
			justify={'space-between'}
			align={'center'}
			style={{
				borderBottom: '1px solid #333',
			}}
		>
			<MetzBannerComponent size={30} title={props.bannerTitle} />
			<Box mr={20}>{props.rightSection || <SupportButton />}</Box>
		</Flex>
	);
}
