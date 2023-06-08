import axios from 'axios';
import { useContext, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, Input, Modal } from 'components';
import { Context } from 'utils/context';
import { postMusicGenreDisplayTextEndpoint } from 'utils/endpoints';
import { mdButtonStyle } from 'utils/styles';
import {
	chooseGenreDisplayTextText,
	errorInvalidInputText,
	errorNoServerResponseText,
	errorText,
	validateText
} from 'utils/texts';
import { MusicGenreType } from 'utils/types';

type PropsType = {
	selectedGenre?: string | undefined;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	updateGenresState: (genres: MusicGenreType[]) => void;
};

export const AddGenreDisplayTextModal = (props: PropsType) => {
	const { selectedGenre, setIsOpen, updateGenresState } = props;

	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [genreDisplayTextInput, setGenreDisplayTextInput] = useState('');
	const [isValidateButtonDisabled, setIsValidateButtonDisabled] = useState(false);

	const requestUpdateGenreDisplayText = async () => {
		setIsValidateButtonDisabled(true);

		try {
			if (!genreDisplayTextInput) throw { code: 'ERR_INVALID_INPUT' };

			const response = await axios.post(
				postMusicGenreDisplayTextEndpoint,
				{ displayText: genreDisplayTextInput, spotifyId: selectedGenre },
				{
					headers: { 'Content-Type': 'application/json' }
				}
			);

			updateGenresState(response.data);
			setIsValidateButtonDisabled(false);
			setIsOpen(false);
		} catch (error: any) {
			const { code } = error;

			setIsValidateButtonDisabled(false);

			const errorMessage = () => {
				switch (code) {
					case 'ERR_INVALID_INPUT':
						setGenreDisplayTextInput('');
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
			<StyledPaddedDiv>{`${chooseGenreDisplayTextText[0]}${selectedGenre}${chooseGenreDisplayTextText[1]}`}</StyledPaddedDiv>
			<Input
				input={genreDisplayTextInput}
				setInput={setGenreDisplayTextInput}
			/>
			<Button
				customStyle={paddedButtonStyle}
				isButtonDisabled={isValidateButtonDisabled}
				onClick={requestUpdateGenreDisplayText}
			>
				{validateText}
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
