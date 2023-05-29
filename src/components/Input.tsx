import styled, { css } from 'styled-components';

import { ClearIcon, PasteIcon } from 'assets/icons';
import { Button } from 'components';
import { centeredStyle, StyledCenteredDiv } from 'utils/styles';

type PropsType = {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	width?: string | undefined;
};

export const Input = (props: PropsType) => {
	const { input, setInput, width } = props;

	const clear = () => setInput('');

	const pasteFromClipboard = async () => {
		const clipboard = await navigator.clipboard.readText();
		setInput(clipboard);
	};

	const updateInput = (input: React.ChangeEvent<HTMLInputElement>) => setInput(input.target.value);

	return (
		<StyledCenteredDiv>
			<StyledInput
				onChange={updateInput}
				value={input}
				width={width}
			/>

			<Button
				customStyle={marginedIconStyle}
				onClick={pasteFromClipboard}
			>
				<PasteIcon />
			</Button>

			<Button
				customStyle={marginedIconStyle}
				onClick={clear}
			>
				<ClearIcon />
			</Button>
		</StyledCenteredDiv>
	);
};

const marginedIconStyle = css`
	margin-left: 10px;
	${centeredStyle}
`;

const StyledInput = styled.input<{ width?: string | undefined }>`
	padding: 4px;
	text-align: center;
	${(props) =>
		props.width &&
		css`
			width: ${props.width};
		`}
`;
