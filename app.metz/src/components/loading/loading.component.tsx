import { LoadingOverlay } from '@mantine/core';

export default function () {
	return (
		<LoadingOverlay
			loaderProps={{ size: 'md', color: 'white', variant: 'oval' }}
			visible
			overlayBlur={2}
			overlayColor="rgb(6,6,12)"
		/>
	);
}
