import axios, { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, Input, Modal } from 'components';
import { spotifyColor } from 'utils/colors';
import { Context } from 'utils/context';
import { postMusicArtistEndpoint } from 'utils/endpoints';
import { clickToActionStyle, mdButtonStyle } from 'utils/styles';
import {
	addArtistText,
	artistSpotifyLinkText,
	errorArtistAlreadyAddedText,
	errorInvalidInputText,
	errorNoServerResponseText,
	errorOperationFailedText,
	errorProblemText,
	errorText
} from 'utils/texts';

import type { BooleanDictionnaryType } from 'utils/types';

type PropsType = {
	artistsDictionnary: BooleanDictionnaryType;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	updateArtistsState: (response: AxiosResponse<any, any>) => void;
};

export const AddArtistModal = (props: PropsType) => {
	const { artistsDictionnary, setIsOpen, updateArtistsState } = props;

	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [artistSpotifyLinkInput, setArtistSpotifyLinkInput] = useState('');
	const [isAddArtistButtonDisabled, setIsAddArtistButtonDisabled] = useState(false);

	const requestAddArtist = async () => {
		setIsAddArtistButtonDisabled(true);

		const spotifyId = artistSpotifyLinkInput.split('t/')[1]?.split('?si=')[0];

		try {
			if (!spotifyId) throw { code: 'ERR_INVALID_INPUT' };
			if (artistsDictionnary[spotifyId]) throw { code: 'ERR_ARTIST_ALREADY_ADDED' };

			const response = await axios.post(postMusicArtistEndpoint, spotifyId, {
				headers: { 'Content-Type': 'text/plain' }
			});

			updateArtistsState(response);
			setIsAddArtistButtonDisabled(false);
			setIsOpen(false);
		} catch (error: any) {
			const { code } = error;

			setIsAddArtistButtonDisabled(false);

			const errorMessage = () => {
				switch (code) {
					case 'ERR_ARTIST_ALREADY_ADDED':
						setArtistSpotifyLinkInput('');
						return errorArtistAlreadyAddedText;
					case 'ERR_BAD_REQUEST':
						setArtistSpotifyLinkInput('');
						return errorOperationFailedText;
					case 'ERR_BAD_RESPONSE':
						return errorProblemText;
					case 'ERR_INVALID_INPUT':
						setArtistSpotifyLinkInput('');
						return errorInvalidInputText;
					case 'ERR_NETWORK':
						return errorNoServerResponseText;
					default:
						return `${errorText} : ${code}`;
				}
			};
			openErrorNotification(errorMessage());
		}
	};

	return (
		<Modal setIsOpen={setIsOpen}>
			<StyledPaddedDiv>
				<>{artistSpotifyLinkText[0]} </>
				<StyledSpotifyLink href="https://open.spotify.com/">{artistSpotifyLinkText[1]}</StyledSpotifyLink>
				<> {artistSpotifyLinkText[2]}</>
			</StyledPaddedDiv>

			<Input
				canCopyFromClipboard
				input={artistSpotifyLinkInput}
				setInput={setArtistSpotifyLinkInput}
				width="544px"
			/>

			<Button
				customStyle={paddedButtonStyle}
				onClick={requestAddArtist}
				isButtonDisabled={isAddArtistButtonDisabled}
			>
				{addArtistText}
			</Button>
		</Modal>
	);
};

const paddedButtonStyle = css`
	margin-top: 32px;
	${mdButtonStyle}
`;

const StyledPaddedDiv = styled.div`
	padding-bottom: 8px;
`;

const StyledSpotifyLink = styled.a`
	color: ${spotifyColor};
	${clickToActionStyle}
`;
