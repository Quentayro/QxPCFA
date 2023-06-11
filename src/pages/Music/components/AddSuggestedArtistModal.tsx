import axios, { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, Modal } from 'components';
import { Context } from 'utils/context';
import { postMusicArtistEndpoint } from 'utils/endpoints';
import {
	addSuggestedArtistText,
	errorNoServerResponseText,
	errorOperationFailedText,
	errorProblemText,
	errorText,
	noText,
	yesText
} from 'utils/texts';
import { mdButtonStyle, StyledCenteredDiv, StyledMusicArtistPicture } from 'utils/styles';
import { spotifyPictureUrlPlaceholder, spotifyPictureUrlPrefix } from 'utils/constants';

import type { MusicArtistType } from 'utils/types';

type PropsType = {
	artist?: MusicArtistType | undefined;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	updateArtistsStates: (response: AxiosResponse<any, any>) => void;
};

export const AddSuggestedArtistModal = (props: PropsType) => {
	const { artist, setIsOpen, updateArtistsStates } = props;

	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [isYesDisabled, setIsYesButtonDisabled] = useState(false);

	const closeModal = () => setIsOpen(false);

	const requestAddArtist = async () => {
		setIsYesButtonDisabled(true);

		const spotifyId = artist?.spotifyId;

		try {
			if (!spotifyId) throw { code: 'ERR_INVALID_INPUT' };

			const reponse = await axios.post(postMusicArtistEndpoint, spotifyId, {
				headers: { 'Content-Type': 'text/plain' }
			});

			updateArtistsStates(reponse);
			setIsYesButtonDisabled(false);
			setIsOpen(false);
		} catch (error: any) {
			const { code } = error;

			setIsYesButtonDisabled(false);

			const errorMessage = () => {
				switch (code) {
					case 'ERR_BAD_REQUEST':
						setIsOpen(false);
						return errorOperationFailedText;
					case 'ERR_BAD_RESPONSE':
						return errorProblemText;
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
				{`${addSuggestedArtistText[0]} ${artist?.name} ${addSuggestedArtistText[1]}`}
			</StyledPaddedDiv>

			<StyledMusicArtistPicture
				src={`${spotifyPictureUrlPrefix}${artist?.picture ? artist.picture : spotifyPictureUrlPlaceholder}`}
				alt={`${artist?.name} picture`}
			/>

			<StyledCenteredDiv>
				<Button
					customStyle={marginedButtonStyle}
					onClick={requestAddArtist}
					isButtonDisabled={isYesDisabled}
				>
					{yesText}
				</Button>

				<Button
					customStyle={marginedButtonStyle}
					onClick={closeModal}
					isButtonDisabled={isYesDisabled}
				>
					{noText}
				</Button>
			</StyledCenteredDiv>
		</Modal>
	);
};

const marginedButtonStyle = css`
	margin: 32px 8px 0;
	${mdButtonStyle}
`;

const StyledPaddedDiv = styled.div`
	padding-bottom: 32px;
`;
