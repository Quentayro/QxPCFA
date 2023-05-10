import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from 'components';
import { Error404, Home, MusicArtists } from 'pages';
import { homePath, musicArtistsPath } from 'utils/paths';

export const App = () => {
	const router = createBrowserRouter([
		{
			element: <Layout />,
			errorElement: <Error404 />,
			children: [
				{
					path: homePath,
					element: <Home />
				},
				{
					path: musicArtistsPath,
					element: <MusicArtists />
				}
			]
		}
	]);

	return <RouterProvider router={router} />;
};
