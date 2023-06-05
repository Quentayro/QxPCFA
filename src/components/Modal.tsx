import { Overlay } from 'components';
import styled from 'styled-components';

import { modalBackgroundColor } from 'utils/colors';
import { centeredColumnStyle } from 'utils/styles';

type PropsType = {
	children: React.ReactNode;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = (props: PropsType) => {
	const { children, setIsOpen } = props;

	return (
		<Overlay
			isBlocking={true}
			setIsOpen={setIsOpen}
		>
			<StyledModal>{children}</StyledModal>
		</Overlay>
	);
};

const StyledModal = styled.div`
	background-color: ${modalBackgroundColor};
	border-radius: 8px;
	${centeredColumnStyle}
	padding: 32px;
`;
