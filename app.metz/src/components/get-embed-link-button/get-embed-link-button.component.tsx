import { Button, rem, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import ButtonComponent from '../button/button.component';
import { CgCheck } from 'react-icons/cg';
import { BiCopy } from 'react-icons/bi';
import { useGetEmbedLinkProject } from '../../repositories/project/use-get-embed-link.hook';
import { useEffect, useState } from 'react';

export function GetEmbedLink(props: { projectId: string; text: string }) {
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
		<ButtonComponent
			loading={isMutating}
			icon={clipboard.copied ? <CgCheck /> : <BiCopy />}
			onClick={() => {
				trigger().then(setCode);
			}}
		>
			{props.text}
		</ButtonComponent>
	);
}
