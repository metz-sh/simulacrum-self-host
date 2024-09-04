import { FaFolder, FaFolderPlus } from 'react-icons/fa';
import ButtonComponent from '../button/button.component';
import { useCreateProject } from '../../repositories/project/use-create-project.hook';
import { mutate } from 'swr';
import { getProjectListAPIUrl } from '../../repositories/project/use-project-list.hook';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import IconButtonComponent from '../icon-button/icon-button.component';

export default function (props: { title?: string; templateId?: number; newTab?: boolean }) {
	const router = useRouter();

	const { trigger, isMutating, error, data } = useCreateProject();

	useEffect(() => {
		if (data) {
			mutate(getProjectListAPIUrl());
			if (props.newTab) {
				window.open(`/project/${data.project_id}`, '_blank');
				return;
			}
			router.push(`/project/${data.project_id}`);
		}
	}, [data]);

	return (
		<IconButtonComponent
			tip="Create project"
			icon={<FaFolderPlus />}
			loading={isMutating}
			onClick={() => {
				trigger({
					template_id: props.templateId,
				});
			}}
		/>
	);
}
