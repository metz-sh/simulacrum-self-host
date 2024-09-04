import { BiBook } from 'react-icons/bi';
import IconButtonComponent from '../icon-button/icon-button.component';
import { Paper } from '@mantine/core';
import { openModal } from '../open-modal/open-modal';
import { GiSecretBook } from 'react-icons/gi';
import { FaBook } from 'react-icons/fa';
import TipComponent from '../tip/tip.component';

function DocInIframe(props: { src: string }) {
	return (
		<Paper h={'80vh'}>
			<iframe height={'100%'} width={'100%'} src={props.src} style={{ border: 'none' }} />
		</Paper>
	);
}

export default function (props: { title?: string; minimal?: boolean; link: string }) {
	return (
		<TipComponent text={props.title || 'Open docs'}>
			<IconButtonComponent
				minimal={props.minimal}
				icon={<GiSecretBook size={props.minimal ? 20 : undefined} />}
				onClick={() => {
					window.open(props.link, '_blank');
				}}
			/>
		</TipComponent>
	);
}
