import styled, { css } from 'styled-components';

import { ClearIcon, PasteIcon } from 'assets/icons';
import { Button } from 'components';
import { centeredStyle, StyledCenteredDiv } from 'utils/styles';

type PropsType = {
	canCopyFromClipboard?: boolean | undefined;
	input: string;
	maxWidth?: string | undefined;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	width?: string | undefined;
};

export const Input = (props: PropsType) => {
	const { canCopyFromClipboard, input, maxWidth, setInput, width } = props;

	const clear = () => setInput('');

	const pasteFromClipboard = async () => {
		const clipboard = await navigator.clipboard.readText();
		setInput(clipboard);
	};

	const updateInput = (input: React.ChangeEvent<HTMLInputElement>) => setInput(input.target.value);

	return (
		<StyledCenteredDiv>
			<StyledInput
				maxWidth={maxWidth}
				onChange={updateInput}
				value={input}
				width={width}
			/>

			{canCopyFromClipboard && (
				<Button
					customStyle={marginedIconStyle}
					onClick={pasteFromClipboard}
				>
					<PasteIcon />
				</Button>
			)}

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

const StyledInput = styled.input<{ maxWidth?: string | undefined; width?: string | undefined }>`
	padding: 4px;
	text-align: center;
	${(props) =>
		props.maxWidth &&
		css`
			max-width: ${props.maxWidth};
		`}

	${(props) =>
		props.width &&
		css`
			width: ${props.width};
		`}
`;
