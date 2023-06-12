import { Header, RouterLink, StyledLayout, StyledOutletContainer } from 'components';
import { homePath } from 'utils/paths';
import { mdButtonStyle, StyledH1 } from 'utils/styles';
import { error404Text, returnHomeText } from 'utils/texts';

export const Error404 = () => (
	<StyledLayout>
		<Header />
		<StyledOutletContainer>
			<StyledH1>{error404Text}</StyledH1>
			<RouterLink
				customStyle={mdButtonStyle}
				to={homePath}
			>
				{returnHomeText}
			</RouterLink>
		</StyledOutletContainer>
	</StyledLayout>
);
