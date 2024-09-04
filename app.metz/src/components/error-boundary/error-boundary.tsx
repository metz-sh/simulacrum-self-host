import { Box, Button, Paper, Text, Tooltip, createStyles } from '@mantine/core';
import React, { ReactNode } from 'react';
import { VscBracketError } from 'react-icons/vsc';
import BoxHolder from '../box-holder';
import { BsSlack } from 'react-icons/bs';
import ButtonComponent from '../button/button.component';

class ErrorBoundary extends React.Component {
	public readonly state:
		| {
				hasError: false;
		  }
		| {
				hasError: true;
				error: any;
		  } = { hasError: false };
	constructor(readonly props: { children: ReactNode }) {
		super(props);
	}
	static getDerivedStateFromError(error: any) {
		return { hasError: true, error };
	}

	componentDidCatch(error: any, errorInfo: any) {
		console.error({ error, errorInfo });
	}
	render() {
		if (this.state.hasError) {
			return (
				<Box
					sx={{
						width: '100vw',
						height: '100vh',
					}}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
						}}
					>
						<Text fz={'45px'} color="#a63d0a">
							System flatlined
						</Text>
						{this.state.error.message && (
							<div>
								<Text ff={'Fira mono'} color="#777" fz={'sm'}>
									{this.state.error.message}
								</Text>
							</div>
						)}
						<div style={{ marginTop: '20px' }}>
							<Tooltip
								offset={10}
								radius={7}
								styles={{
									tooltip: {
										border: '1px solid #222',
									},
								}}
								color="rgb(20, 20,25)"
								position="bottom"
								label="Error report has been sent. Join us on slack and we will look at this right away!"
							>
								<ButtonComponent
									icon={<BsSlack />}
									onClick={() => {
										window.open(
											'https://join.slack.com/t/metzcommunity/shared_invite/zt-1xr4ooes0-AhIP47ENEqrKmnfpCw6e8Q',
											'_blank'
										);
									}}
								>
									Report on Slack
								</ButtonComponent>
							</Tooltip>
						</div>
					</div>
				</Box>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
