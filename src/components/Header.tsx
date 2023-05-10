import styled from 'styled-components';

import { RouterLink } from 'components';
import { backgroundColor } from 'utils/colors';
import { headerHeightConstant } from 'utils/constants';
import { homePath } from 'utils/paths';
import { centeredStyle, h2Style } from 'utils/styles';
import { logoText } from 'utils/texts';

export const Header = () => (
	<StyledHeader>
		<RouterLink
			customStyle={h2Style}
			to={homePath}
		>
			{logoText}
		</RouterLink>
	</StyledHeader>
);

const StyledHeader = styled.div`
	background-color: ${backgroundColor};
	border-bottom: 1px solid;
	height: ${headerHeightConstant};
	position: fixed;
	width: 100%;
	${centeredStyle}
`;
