import styled, { css } from 'styled-components';

import { activeColor, disabledColor, hoverColor, mainColor } from 'utils/colors';

export const centeredStyle = css`
	align-items: center;
	display: flex;
	justify-content: center;
`;

export const clickToActionStyle = css`
	cursor: pointer !important;
	fill: ${mainColor};
	&:hover {
		color: ${hoverColor};
		fill: ${hoverColor};
	}
	&:active {
		color: ${activeColor};
		fill: ${activeColor};
	}
	&:disabled {
		color: ${disabledColor};
		cursor: not-allowed;
		fill: ${disabledColor};
	}
`;

const h1Style = css`
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
	margin: 0;
	padding: 8px 0;
`;

export const buttonStyle = css`
	border: 4px solid;
	border-radius: 8px;
	font-weight: 700;
	${centeredStyle}
`;

export const centeredColumnStyle = css`
	flex-direction: column;
	${centeredStyle}
`;

export const mdButtonStyle = css`
	padding: 8px 16px;
	${buttonStyle}
`;

export const musicArtistPictureStyle = css`
	object-fit: cover;
`;

export const StyledCenteredDiv = styled.div`
	${centeredStyle}
`;

export const StyledH1 = styled.h1`
	${h1Style}
`;

export const StyledH2 = styled.h2`
	${h2Style}
`;

export const StyledMusicArtistPicture = styled.img`
	border-radius: 2px;
	flex-shrink: 0;
	height: 160px;
	width: 160px;
	${musicArtistPictureStyle}
`;
