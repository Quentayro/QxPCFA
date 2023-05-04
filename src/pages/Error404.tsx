import { Header, RouterLink, StyledLayout, StyledOutletContainer } from 'components';
import { homePath } from 'utils/paths';
import { buttonStyle, StyledH1 } from 'utils/styles';
import { error404Text, returnHomeText } from 'utils/texts';

export const Error404 = () => {
	return (
		<StyledLayout>
			<Header />
			<StyledOutletContainer>
				<StyledH1>{error404Text}</StyledH1>
				<RouterLink
					customStyle={buttonStyle}
					to={homePath}
				>
					{returnHomeText}
				</RouterLink>
			</StyledOutletContainer>
		</StyledLayout>
	);
};
