import { Button, rem, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import ButtonComponent from '../button/button.component';
import { CgCheck } from 'react-icons/cg';
import { BiCopy } from 'react-icons/bi';
import { useGetEmbedLinkProject } from '../../repositories/project/use-get-embed-link.hook';
import { useEffect, useState } from 'react';
import IconButtonComponent from '../icon-button/icon-button.component';
import { TbWorldShare } from 'react-icons/tb';
import TipComponent from '../tip/tip.component';

export function GetEmbedLinkIcon(props: { projectId: string; text: string }) {
	const clipboard = useClipboard();
	const { isMutating, trigger } = useGetEmbedLinkProject({ id: props.projectId });
	const [code, setCode] = useState<{ embed_id: string }>();

	useEffect(() => {
		if (!code) {
			return;
		}
		const urlToCopy = `${window.location.origin}/play/${code.embed_id}`;
		clipboard.copy(urlToCopy);
	}, [code]);

	return (
		<TipComponent text={clipboard.copied ? 'Copied successfully!' : props.text}>
			<IconButtonComponent
				minimal={true}
				loading={isMutating}
				icon={clipboard.copied ? <CgCheck /> : <TbWorldShare color="orange" size={20} />}
				onClick={() => {
					trigger().then(setCode);
				}}
			/>
		</TipComponent>
	);
}
