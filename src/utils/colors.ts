export const activeColor = 'red';
export const backgroundColor = 'black';
export const disabledColor = 'grey';
export const errorColor = 'red';
export const hoverColor = 'yellow';
export const mainColor = 'white';
export const modalBackgroundColor = '#181818';
export const pushedColor = 'dodgerblue';
export const qualityGradientColors = [
	'red',
	'#FF2B00',
	'#FF5600',
	'#FF8100',
	'#FFAC00',
	'gold',
	'#CCC500',
	'#99B400',
	'#66A200',
	'#339100',
	'green'
];
export const spotifyColor = '#1DB954';
export const warningColor = 'orange';

export const getQualityGradientColor = (score: number) => {
	return qualityGradientColors[Math.round(score / 10)];
};
