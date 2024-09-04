import ButtonComponent from '../button/button.component';
import { BsSlack } from 'react-icons/bs';
import IconButtonComponent from '../icon-button/icon-button.component';

export default function (props: { minimal?: boolean }) {
	if (props.minimal) {
		return (
			<IconButtonComponent
				icon={<BsSlack />}
				onClick={() => {
					window.open(
						'https://metzcommunity.slack.com/join/shared_invite/zt-1xr4ooes0-AhIP47ENEqrKmnfpCw6e8Q#/shared-invite/email',
						'_blank'
					);
				}}
			/>
		);
	}
	return (
		<ButtonComponent
			icon={<BsSlack />}
			onClick={() => {
				window.open(
					'https://metzcommunity.slack.com/join/shared_invite/zt-1xr4ooes0-AhIP47ENEqrKmnfpCw6e8Q#/shared-invite/email',
					'_blank'
				);
			}}
		>
			Join our Slack
		</ButtonComponent>
	);
}
