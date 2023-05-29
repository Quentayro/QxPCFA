import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { mainColor } from 'utils/colors';
import { clickToActionStyle } from 'utils/styles';

import type { FlattenSimpleInterpolation } from 'styled-components';

type PropsType = {
	children: React.ReactNode;
	customStyle?: FlattenSimpleInterpolation | undefined;
	to: string;
};

export const RouterLink = (props: PropsType) => {
	const { children, customStyle, to } = props;

	return (
		<StyledLink
			$customStyle={customStyle}
			to={to}
		>
			{children}
		</StyledLink>
	);
};

const StyledLink = styled(Link)<{ $customStyle?: FlattenSimpleInterpolation | undefined }>`
	color: ${mainColor};
	text-decoration: none;
	${clickToActionStyle}
	${(props) => props.$customStyle && props.$customStyle}
`;
