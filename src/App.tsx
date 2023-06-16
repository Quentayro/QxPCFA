import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from 'components';
import { Error404, Home, MusicArtists } from 'pages';
import { Context } from 'utils/context';
import { homePath, musicArtistPath, musicArtistsPath } from 'utils/paths';
import { MusicArtist } from 'pages/Music';

export const App = () => {
	const [errorMessage, setErrorMessage] = useState('');
	const [errorNotificationTimeoutId, setErrorNotificationTimeoutId] = useState<NodeJS.Timeout>();
	const [isErrorNotificationOpen, setIsErrorNotificationOpen] = useState(false);

	const openErrorNotification = (errorMessage: string) => {
		console.error(errorMessage);
		errorNotificationTimeoutId && clearTimeout(errorNotificationTimeoutId);
		setErrorMessage(errorMessage);
		setIsErrorNotificationOpen(true);
		setErrorNotificationTimeoutId(
			setTimeout(() => {
				setIsErrorNotificationOpen(false);
				setErrorMessage('');
				setErrorNotificationTimeoutId(undefined);
			}, 5000)
		);
	};

	const context = { errorMessage: errorMessage, openErrorNotification: openErrorNotification };

	const router = createBrowserRouter([
		{
			element: <Layout isErrorNotificationOpen={isErrorNotificationOpen} />,
			errorElement: <Error404 />,
			children: [
				{
					path: homePath,
					element: <Home />
				},
				{
					path: musicArtistPath + ':spotifyId',
					element: <MusicArtist />
				},
				{
					path: musicArtistsPath,
					element: <MusicArtists />
				}
			]
		}
	]);

	return (
		<Context.Provider value={context}>
			<RouterProvider router={router} />
		</Context.Provider>
	);
};
