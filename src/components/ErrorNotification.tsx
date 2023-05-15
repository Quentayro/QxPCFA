import { useContext } from 'react';
import styled from 'styled-components';

import { Overlay } from 'components';
import { errorColor } from 'utils/colors';
import { Context } from 'utils/context';

export const ErrorNotification = () => {
	const context = useContext(Context);
	const { errorMessage } = context;

	return (
		<Overlay position="bottom">
			<StyledModal>{errorMessage}</StyledModal>
		</Overlay>
	);
};

const StyledModal = styled.div`
	background-color: ${errorColor};
	border-radius: 8px;
	padding: 16px;
	margin: 8px;
`;
