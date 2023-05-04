import styled, { css } from 'styled-components';

import { activeColor, hoverColor } from 'utils/colors';

export const buttonStyle = css`
	border: 4px solid;
	border-radius: 8px;
	font-weight: 700;
	padding: 8px 16px;
`;

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

const h1Style = css`
	cursor: default;
	font-family: Roboto, Lato, sans-serif;
	font-size: 64px;
	font-weight: 900;
	margin: 0;
	padding: 16px 0;
`;

export const h2Style = css`
	font-family: Roboto, Lato, sans-serif;
	font-size: 32px;
	font-weight: 700;
	padding: 8px 0;
`;

export const StyledH1 = styled.h1`
	${h1Style}
`;
