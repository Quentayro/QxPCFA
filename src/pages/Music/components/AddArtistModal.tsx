import { useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, Input, Overlay } from 'components';
import { modalBackgroundColor, spotifyColor } from 'utils/colors';
import { centeredColumnStyle, clickToActionStyle, mdButtonStyle } from 'utils/styles';
import { artistSpotifyLinkText } from 'utils/texts';

type Props = {
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

export const AddArtistModal = (props: Props) => {
	const { setIsOpen } = props;

	const [artistSpotifyLinkInput, setArtistSpotifyLinkInput] = useState(
		'https://open.spotify.com/artist/4eQJIXFEujzhTVVS1gIfu5?si=er21Ci5SRgub-MtbWbVPwg'
	);

	const requestAddArtist = () => {
		// TODO
		console.log('XXX - requestAddArtist - XXX');
		console.log('artistSpotifyLinkInput :', artistSpotifyLinkInput);
		const spotifyId = artistSpotifyLinkInput.substring(32, 54);
		console.log('spotifyId', spotifyId);
	};

	return (
		<Overlay
			isBlocking={true}
			setIsOpen={setIsOpen}
		>
			<StyledModal>
				<StyledPaddedDiv>
					<>{artistSpotifyLinkText[0]} </>
					<StyledSpotifyLink href="https://open.spotify.com/">{artistSpotifyLinkText[1]}</StyledSpotifyLink>
					<> {artistSpotifyLinkText[2]}</>
				</StyledPaddedDiv>

				<Input
					input={artistSpotifyLinkInput}
					setInput={setArtistSpotifyLinkInput}
					width="544px"
				/>

				<Button
					customStyle={paddedButtonStyle}
					onClick={requestAddArtist}
				>
					Button
				</Button>
			</StyledModal>
		</Overlay>
	);
};

const paddedButtonStyle = css`
	margin-top: 32px;
	${mdButtonStyle}
`;

const StyledModal = styled.div`
	background-color: ${modalBackgroundColor};
	border-radius: 8px;
	${centeredColumnStyle}
	padding: 32px;
`;

const StyledPaddedDiv = styled.div`
	padding-bottom: 8px;
`;

const StyledSpotifyLink = styled.a`
	color: ${spotifyColor};
	${clickToActionStyle}
`;
