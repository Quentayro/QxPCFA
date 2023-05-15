import { createContext } from 'react';

const initialContext = {
	errorMessage: '',
	openErrorNotification: (errorMessage: string) => {
		console.log(errorMessage);
	}
};

export const Context = createContext(initialContext);
