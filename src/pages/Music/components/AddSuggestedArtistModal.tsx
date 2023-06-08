import axios, { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';

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
import { MusicArtistType } from 'utils/types';
import { StyledCenteredDiv, StyledMusicArtistPicture, mdButtonStyle } from 'utils/styles';
import styled, { css } from 'styled-components';
import { spotifyPictureUrlPlaceholder, spotifyPictureUrlPrefix } from 'utils/constants';

type PropsType = {
	selectedSuggestedArtist?: MusicArtistType | undefined;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	updateArtistsState: (response: AxiosResponse<any, any>) => void;
};

export const AddSuggestedArtistModal = (props: PropsType) => {
	const { selectedSuggestedArtist, setIsOpen, updateArtistsState } = props;

	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [isYesDisabled, setIsYesButtonDisabled] = useState(false);

	const closeModal = () => setIsOpen(false);

	const requestAddArtist = async () => {
		setIsYesButtonDisabled(true);

		const spotifyId = selectedSuggestedArtist?.spotifyId;

		try {
			if (!spotifyId) throw { code: 'ERR_INVALID_INPUT' };

			const reponse = await axios.post(postMusicArtistEndpoint, spotifyId, {
				headers: { 'Content-Type': 'text/plain' }
			});

			updateArtistsState(reponse);
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
			<StyledPaddedDiv>{`${addSuggestedArtistText[0]} ${selectedSuggestedArtist?.name} ${addSuggestedArtistText[1]}`}</StyledPaddedDiv>
			<StyledMusicArtistPicture
				src={`${spotifyPictureUrlPrefix}${
					selectedSuggestedArtist?.picture ? selectedSuggestedArtist.picture : spotifyPictureUrlPlaceholder
				}`}
				alt={`${selectedSuggestedArtist?.name} picture`}
			/>
			<StyledCenteredDiv>
				<Button
					customStyle={paddedButtonStyle}
					onClick={requestAddArtist}
					isButtonDisabled={isYesDisabled}
				>
					{yesText}
				</Button>
				<Button
					customStyle={paddedButtonStyle}
					onClick={closeModal}
					isButtonDisabled={isYesDisabled}
				>
					{noText}
				</Button>
			</StyledCenteredDiv>
		</Modal>
	);
};

const StyledPaddedDiv = styled.div`
	padding-bottom: 32px;
`;

const paddedButtonStyle = css`
	margin: 32px 8px 0;
	${mdButtonStyle}
`;
