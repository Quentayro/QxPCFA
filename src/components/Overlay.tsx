import styled, { css } from 'styled-components';

import { backgroundColor } from 'utils/colors';

type PropsType = {
	children: React.ReactNode;
	isBlocking?: boolean | undefined;
	position?: 'bottom' | undefined;
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

export const Overlay = (props: PropsType) => {
	const { children, isBlocking, position, setIsOpen } = props;

	const closeOverlay = () => setIsOpen && setIsOpen(false);

	return (
		<StyledOverlay
			isBlocking={isBlocking}
			position={position}
		>
			{isBlocking && <StyledBlockingLayer onClick={closeOverlay} />}
			{children}
		</StyledOverlay>
	);
};

const wholeScreenStyle = css`
	height: 100vh;
	position: fixed;
	top: 0;
	width: 100%;
`;

const StyledBlockingLayer = styled.div`
	background-color: ${backgroundColor};
	cursor: pointer;
	opacity: 0.9;
	z-index: -1;
	${wholeScreenStyle}
`;

const StyledOverlay = styled.div<{
	position?: 'bottom' | undefined;
	isBlocking?: boolean | undefined;
}>`
	align-items: ${(props) => (props.position === 'bottom' ? 'end' : 'center')};
	display: flex;
	justify-content: center;
	${wholeScreenStyle}
	${(props) =>
		!props.isBlocking &&
		css`
			pointer-events: none;
		`}
`;
