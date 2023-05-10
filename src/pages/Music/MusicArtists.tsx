import { useState } from 'react';

import { Button } from 'components';
import { AddArtistModal } from 'pages/Music/components';
import { StyledH1 } from 'utils/styles';
import { addArtistText, artistsText } from 'utils/texts';

export const MusicArtists = () => {
	const [isAddArtistModalOpen, setIsAddArtistmodalOpen] = useState(false);

	const openAddArtistModal = () => setIsAddArtistmodalOpen(!isAddArtistModalOpen);

	return (
		<>
			<StyledH1>{artistsText}</StyledH1>
			<Button onClick={openAddArtistModal}>{addArtistText}</Button>
			{isAddArtistModalOpen && <AddArtistModal setIsOpen={setIsAddArtistmodalOpen} />}
		</>
	);
};
