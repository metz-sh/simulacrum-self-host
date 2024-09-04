import { FaFolder, FaFolderPlus } from 'react-icons/fa';
import ButtonComponent from '../button/button.component';
import { useCreateProject } from '../../repositories/project/use-create-project.hook';
import { mutate } from 'swr';
import { getProjectListAPIUrl } from '../../repositories/project/use-project-list.hook';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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
		<ButtonComponent
			icon={<FaFolderPlus />}
			loading={isMutating}
			onClick={() => {
				trigger({
					template_id: props.templateId,
				});
			}}
		>
			{props.title || 'Create Project'}
		</ButtonComponent>
	);
}
