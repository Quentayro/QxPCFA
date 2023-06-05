const baseUrl = 'http://localhost:8080';

// Music endpoints
const musicUrl = `${baseUrl}/music`;

export const getMusicArtistsEndpoint = `${musicUrl}/getArtists`;
export const postMusicArtistEndpoint = `${musicUrl}/postArtist`;
export const postMusicGenreDisplayTextEndpoint = `${musicUrl}/postMusicGenreDisplayText`;
