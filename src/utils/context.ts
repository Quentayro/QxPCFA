import { createContext } from 'react';

const initialContext = {
	errorMessage: '',
	openErrorNotification: (errorMessage: string) => {
		console.error(errorMessage);
	}
};

export const Context = createContext(initialContext);
