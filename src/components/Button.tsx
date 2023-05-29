import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { clickToActionStyle, mdButtonStyle } from 'utils/styles';

type PropsTypeType = {
	children: React.ReactNode;
	customStyle?: FlattenSimpleInterpolation | undefined;
	isButtonDisabled?: boolean | undefined;
	onClick: () => void;
};

export const Button = (props: PropsTypeType) => {
	const { children, customStyle, isButtonDisabled, onClick } = props;

	return (
		<StyledButton
			customStyle={customStyle}
			disabled={isButtonDisabled}
			onClick={onClick}
		>
			{children}
		</StyledButton>
	);
};

const StyledButton = styled.button<{ customStyle?: FlattenSimpleInterpolation | undefined }>`
	all: unset;
	${clickToActionStyle}
	${(props) => (props.customStyle ? props.customStyle : mdButtonStyle)}
`;
