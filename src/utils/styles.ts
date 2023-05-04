import { css } from 'styled-components';

import { activeColor, hoverColor } from 'utils/colors';

export const centeredStyle = css`
	align-items: center;
	display: flex;
	justify-content: center;
`;

export const centeredColumnStyle = css`
	flex-direction: column;
	${centeredStyle}
`;

export const clickToActionStyle = css`
	&:hover {
		color: ${hoverColor};
	}
	&:active {
		color: ${activeColor};
	}
`;

export const subtitleStyle = css`
	font-family: Roboto, Lato, sans-serif;
	font-size: 32px;
	font-weight: 700;
	padding: 8px;
`;
