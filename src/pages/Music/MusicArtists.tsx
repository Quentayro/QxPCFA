import { useEffect, useState } from 'react';

import { Button } from 'components';
import { AddArtistModal } from 'pages/Music/components';
import { StyledH1 } from 'utils/styles';
import { addArtistText, artistsText } from 'utils/texts';

import type { BooleanDictionnaryType, MusicArtistType } from 'utils/types';

export const MusicArtists = () => {
	const [artists, setArtists] = useState<MusicArtistType[]>([]);
	const [artistsDictionnary, setArtistsDictionnary] = useState<BooleanDictionnaryType>({});
	const [isAddArtistModalOpen, setIsAddArtistmodalOpen] = useState(false);

	useEffect(() => {
		const artists = [
			/*{ spotifyId: '4eQJIXFEujzhTVVS1gIfu5' }, */ { spotifyId: '4eQJIXFEujzhTVVS1gIfu5 : Deee-Lite' }
		]; // TODO : Replace with an API call
		setArtists(artists);

		const initialArtistsDictionnary: BooleanDictionnaryType = {};
		for (const artist of artists) {
			initialArtistsDictionnary[artist.spotifyId] = true;
		}
		setArtistsDictionnary(initialArtistsDictionnary);
	}, []);

	const openCloseAddArtistModal = () => setIsAddArtistmodalOpen(!isAddArtistModalOpen);

	return (
		<>
			<StyledH1>{artistsText}</StyledH1>
			<Button onClick={openCloseAddArtistModal}>{addArtistText}</Button>
			{artists.map(
				// TODO : Delete
				(artist: MusicArtistType) => (
					<div key={artist.spotifyId}>{artist.spotifyId}</div>
				)
			)}
			{isAddArtistModalOpen && (
				<AddArtistModal
					artistsDictionnary={artistsDictionnary}
					setIsOpen={setIsAddArtistmodalOpen}
				/>
			)}
		</>
	);
};
