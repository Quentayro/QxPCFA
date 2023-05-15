import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { ErrorNotification, Header } from 'components';
import { backgroundColor, mainColor } from 'utils/colors';
import { headerHeightConstant } from 'utils/constants';
import { centeredColumnStyle } from 'utils/styles';

type Props = {
	isErrorNotificationOpen: boolean;
};

export const Layout = (props: Props) => {
	const { isErrorNotificationOpen } = props;

	return (
		<StyledLayout>
			<Header />
			<StyledOutletContainer>
				<Outlet />
			</StyledOutletContainer>
			{isErrorNotificationOpen && <ErrorNotification />}
		</StyledLayout>
	);
};

export const StyledLayout = styled.div`
	background-color: ${backgroundColor};
	color: ${mainColor};
	font-family: Lato, sans-serif;
`;

export const StyledOutletContainer = styled.div`
	min-height: calc(100vh - ${headerHeightConstant});
	padding-top: ${headerHeightConstant};
	${centeredColumnStyle}
`;
