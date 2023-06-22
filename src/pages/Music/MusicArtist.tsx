import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from 'utils/context';
import { getMusicArtistEndpoint } from 'utils/endpoints';
import { errorNoServerResponseText, errorText } from 'utils/texts';

export const MusicArtist = () => {
	const context = useContext(Context);
	const { openErrorNotification } = context;

	const { spotifyId } = useParams();

	useEffect(() => {
		requestGetArtist();
	}, []);

	const requestGetArtist = async () => {
		try {
			const response = await axios.get(getMusicArtistEndpoint, { params: { spotifyId: spotifyId } });
			console.log('response data : ', response.data);
		} catch (error: any) {
			const { code } = error;

			const errorMessage = () => {
				switch (code) {
					case 'ERR_NETWORK':
						return errorNoServerResponseText;
					default:
						return `${errorText} : ${code}`;
				}
			};
			openErrorNotification(errorMessage());
		}
	};

	return <>WIP</>;
};
