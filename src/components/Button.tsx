import styled, { FlattenSimpleInterpolation } from 'styled-components';

import { clickToActionStyle, mdButtonStyle } from 'utils/styles';

type Props = {
	children: React.ReactNode;
	customStyle?: FlattenSimpleInterpolation | undefined;
	onClick: () => void;
};

export const Button = (props: Props) => {
	const { children, customStyle, onClick } = props;

	return (
		<StyledButton
			customStyle={customStyle}
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
