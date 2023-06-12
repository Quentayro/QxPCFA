export type BooleanDictionnaryType = { [key: string]: boolean };

export type MusicArtistType = {
	firstRankDate?: string | undefined;
	genres: string[];
	id: number;
	name: string;
	originalANumber: number;
	originalBNumber: number;
	originalCNumber: number;
	originalDNumber: number;
	originalScore: number;
	originalSNumber: number;
	originalTracksDuration: number;
	originalTracksNumber: number;
	picture: string;
	remixANumber: number;
	remixBNumber: number;
	remixCNumber: number;
	remixDNumber: number;
	remixSNumber: number;
	remixTracksDuration: number;
	remixTracksNumber: number;
	spotifyId: string;
	totalANumber: number;
	totalBNumber: number;
	totalCNumber: number;
	totalDNumber: number;
	totalScore: number;
	totalSNumber: number;
	totalTracksDuration: number;
	totalTracksNumber: number;
};

export type MusicGenreType = {
	displayText: string;
	spotifyId: string;
};

export type StringDictionnaryType = { [key: string]: string };
