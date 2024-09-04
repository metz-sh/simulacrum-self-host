import { Box, Text } from '@mantine/core';

function EmptyState() {
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					border: '2px dashed #333',
					width: '80%',
					height: '250px',
					borderRadius: '10px',
				}}
			>
				<Text color="#777" p={'xs'} fz={'md'}>
					Whatever you bookmarked on Discover tab will appear here
				</Text>
			</div>
		</Box>
	);
}
export default function () {
	return <EmptyState />;
}
