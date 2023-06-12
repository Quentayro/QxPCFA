import { css } from 'styled-components';

import { RouterLink } from 'components';
import { musicArtistsPath } from 'utils/paths';
import { buttonStyle } from 'utils/styles';
import { musicText } from 'utils/texts';

export const Home = () => (
	<RouterLink
		customStyle={squareButtonStyle}
		to={musicArtistsPath}
	>
		{musicText}
	</RouterLink>
);

const squareButtonStyle = css`
	height: 128px;
	width: 128px;
	${buttonStyle}
`;
