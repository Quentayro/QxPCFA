import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Layout } from 'components';
import { Error404, Home } from 'pages';
import { homePath } from 'utils/paths';

export const App = () => {
	const router = createBrowserRouter([
		{
			element: <Layout />,
			errorElement: <Error404 />,
			children: [
				{
					path: homePath,
					element: <Home />
				}
			]
		}
	]);

	return <RouterProvider router={router} />;
};
