import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, RouterLink } from 'components';
import { AddArtistModal, AddGenreDisplayTextModal, AddSuggestedArtistModal } from 'pages/Music/components';
import { getQualityGradientColor, warningColor } from 'utils/colors';
import { musicPicturePlaceHolder, spotifyPictureUrlPrefix } from 'utils/constants';
import { Context } from 'utils/context';
import { getMusicArtistsEndpoint } from 'utils/endpoints';
import { musicArtistsPath } from 'utils/paths';
import {
	StyledMusicArtistPicture,
	StyledH1,
	StyledH2,
	centeredColumnStyle,
	mdButtonStyle,
	musicArtistPictureStyle,
	StyledCenteredDiv
} from 'utils/styles';
import {
	aText,
	abbreviatedHourText,
	abbreviatedMinuteText,
	addArtistText,
	artistsText,
	bText,
	cText,
	dText,
	detailedViewText,
	durationText,
	errorNoServerResponseText,
	errorText,
	originalScoreText,
	originalTitlesText,
	remixText,
	sText,
	simplifiedViewText,
	suggestionsText,
	totalScoreText,
	totalText
} from 'utils/texts';
import type { BooleanDictionnaryType, MusicArtistType, MusicGenreType, StringDictionnaryType } from 'utils/types';
import { h2Style } from 'utils/styles';

export const MusicArtists = () => {
	// TODO : Display first rank date
	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [areArtistsDetailed, setAreArtistsDetailed] = useState(true); // TODO : change to false
	const [artists, setArtists] = useState<MusicArtistType[]>([]);
	const [artistsDictionnary, setArtistsDictionnary] = useState<BooleanDictionnaryType>({});
	const [genresDictionnary, setGenresDictionnary] = useState<StringDictionnaryType>({});
	const [isAddArtistModalOpen, setIsAddArtistmodalOpen] = useState(false);
	const [isAddGenreDisplayTextModalOpen, setIsAddGenreDisplayTextModalOpen] = useState(false);
	const [isAddSuggestedArtistModalOpen, setIsAddSuggestedArtistModalOpen] = useState(false);
	const [suggestedArtists, setSuggestedArtists] = useState<MusicArtistType[]>([]);
	const [selectedGenre, setSelectedGenre] = useState('');
	const [selectedSuggestedArtist, setSelectedSuggestedArtist] = useState<MusicArtistType>();

	useEffect(() => {
		requestGetArtists();
	}, []);

	useEffect(() => {
		!isAddGenreDisplayTextModalOpen && setSelectedGenre('');
	}, [isAddGenreDisplayTextModalOpen]);

	useEffect(() => {
		!isAddSuggestedArtistModalOpen && setSelectedSuggestedArtist(undefined);
	}, [isAddSuggestedArtistModalOpen]);

	const openAddArtistModal = () => setIsAddArtistmodalOpen(true);

	const openAddGenreDisplayTextModal = (genre: string) => {
		setSelectedGenre(genre);
		setIsAddGenreDisplayTextModalOpen(true);
	};

	const openAddSuggestedArtistModal = (suggestedArtist: MusicArtistType) => {
		setSelectedSuggestedArtist(suggestedArtist);
		setIsAddSuggestedArtistModalOpen(true);
	};

	const requestGetArtists = async () => {
		try {
			const response = await axios.get(getMusicArtistsEndpoint);
			updateArtistsState(response);
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

	const switchArtistView = () => setAreArtistsDetailed(!areArtistsDetailed);

	const updateArtistsState = (response: AxiosResponse<any, any>) => {
		const { artists, genres, suggestedArtists } = response.data;
		setArtists(artists);
		setSuggestedArtists(suggestedArtists);

		const initialArtistsDictionnary: BooleanDictionnaryType = {};
		for (const artist of artists) {
			initialArtistsDictionnary[artist.spotifyId] = true;
		}
		setArtistsDictionnary(initialArtistsDictionnary);

		updateGenresState(genres);
	};

	const updateGenresState = (genres: MusicGenreType[]) => {
		const initialGenresDictionnary: StringDictionnaryType = {};

		for (const genre of genres) {
			const { displayText, spotifyId } = genre;
			initialGenresDictionnary[spotifyId] = displayText;
		}

		setGenresDictionnary(initialGenresDictionnary);
	};

	const msDurationToDisplayDuration = (msDuration: number) => {
		const hDuration = Math.floor(msDuration / 3600000);
		const minDuration = Math.floor((msDuration - hDuration * 3600000) / 60000);

		return `${hDuration} ${abbreviatedHourText} ${minDuration} ${abbreviatedMinuteText}`;
	};

	return (
		<>
			<StyledH1>{artistsText}</StyledH1>
			<StyledCenteredDiv>
				<Button
					customStyle={paddedButtonStyle}
					onClick={openAddArtistModal}
				>
					{addArtistText}
				</Button>
				<Button
					customStyle={paddedButtonStyle}
					onClick={switchArtistView}
				>
					{areArtistsDetailed ? simplifiedViewText : detailedViewText}
				</Button>
			</StyledCenteredDiv>
			{areArtistsDetailed ? (
				<StyledList>
					{artists.map((artist: MusicArtistType) => (
						<StyledListElement key={artist.id}>
							<StyledMusicArtistPicture
								src={`${spotifyPictureUrlPrefix}${
									artist.picture ? artist.picture : musicPicturePlaceHolder
								}`}
								alt={`${artist.name} picture`}
							/>
							<StyledDetailedArtist>
								<RouterLink
									customStyle={h2Style}
									to={musicArtistsPath}
								>
									{artist.name}
								</RouterLink>
								<StyledRow>
									{artist.genres.map((genre: string, index: number) => (
										<StyledRow key={genre}>
											{genresDictionnary[genre] ? (
												<>{genresDictionnary[genre]}</>
											) : (
												<Button
													customStyle={warningGenreStyle}
													onClick={() => openAddGenreDisplayTextModal(genre)}
												>
													{genre}
												</Button>
											)}
											{index !== artist.genres.length - 1 && (
												<StyledPaddedDash>-</StyledPaddedDash>
											)}
										</StyledRow>
									))}
								</StyledRow>
								<StyledScoresGrid>
									<StyledScoresLabel>
										<div>{originalTitlesText}</div>
										<div>{remixText}</div>
										<div>{totalText}</div>
									</StyledScoresLabel>
									<StyledScoresColumn>
										<StyledS>{sText}</StyledS>
										<div>{artist.originalSNumber}</div>
										<div>{artist.remixSNumber}</div>
										<div>{artist.totalSNumber}</div>
									</StyledScoresColumn>
									<StyledScoresColumn>
										<StyledA>{aText}</StyledA>
										<div>{artist.originalANumber}</div>
										<div>{artist.remixANumber}</div>
										<div>{artist.totalANumber}</div>
									</StyledScoresColumn>
									<StyledScoresColumn>
										<StyledB>{bText}</StyledB>
										<div>{artist.originalBNumber}</div>
										<div>{artist.remixBNumber}</div>
										<div>{artist.totalBNumber}</div>
									</StyledScoresColumn>
									<StyledScoresColumn>
										<StyledC>{cText}</StyledC>
										<div>{artist.originalCNumber}</div>
										<div>{artist.remixCNumber}</div>
										<div>{artist.totalCNumber}</div>
									</StyledScoresColumn>
									<StyledScoresColumn>
										<StyledD>{dText}</StyledD>
										<div>{artist.originalDNumber}</div>
										<div>{artist.remixDNumber}</div>
										<div>{artist.totalDNumber}</div>
									</StyledScoresColumn>
									<StyledScoresColumn>
										<div>{totalText}</div>
										<div>{artist.originalTracksNumber}</div>
										<div>{artist.remixTracksNumber}</div>
										<div>{artist.totalTracksNumber}</div>
									</StyledScoresColumn>
									<StyledScoresDurationColumn>
										<div>{durationText}</div>
										<div>{msDurationToDisplayDuration(artist.originalTracksDuration)}</div>
										<div>{msDurationToDisplayDuration(artist.remixTracksDuration)}</div>
										<div>{msDurationToDisplayDuration(artist.totalTracksDuration)}</div>
									</StyledScoresDurationColumn>
								</StyledScoresGrid>
								<StyledCenteredDiv>
									<StylesScoreContainer>
										<StyledScore scoreColor={getQualityGradientColor(artist.originalScore)}>
											{`${Math.round(artist.originalScore)} %`}
										</StyledScore>
										<div>{originalScoreText}</div>
									</StylesScoreContainer>
									<StylesScoreContainer>
										<StyledScore scoreColor={getQualityGradientColor(artist.totalScore)}>
											{`${Math.round(artist.totalScore)} %`}
										</StyledScore>
										<div>{totalScoreText}</div>
									</StylesScoreContainer>
								</StyledCenteredDiv>
							</StyledDetailedArtist>
						</StyledListElement>
					))}
				</StyledList>
			) : (
				<StyledGrid>
					{artists.map((artist: MusicArtistType) => (
						<RouterLink
							key={artist.id}
							to={musicArtistsPath} // TODO : New path
						>
							<StyledArtistCard>
								<StyledMusicArtistPicture
									src={`${spotifyPictureUrlPrefix}${
										artist.picture ? artist.picture : musicPicturePlaceHolder
									}`}
									alt={`${artist.name} picture`}
								/>
								<>{artist.name}</>
							</StyledArtistCard>
						</RouterLink>
					))}
				</StyledGrid>
			)}

			<StyledH2>{suggestionsText}</StyledH2>
			<StyledGrid>
				{suggestedArtists.map((artist: MusicArtistType) => (
					<Button
						customStyle={css``}
						key={artist.id}
						onClick={() => {
							openAddSuggestedArtistModal(artist);
						}}
					>
						<StyledSuggestedArtistCard>
							<StyledSuggestedArtistPicture
								src={`${spotifyPictureUrlPrefix}${
									artist.picture ? artist.picture : musicPicturePlaceHolder
								}`}
								alt={`${artist.name} picture`}
							/>
							<>{artist.name}</>
						</StyledSuggestedArtistCard>
					</Button>
				))}
			</StyledGrid>
			{isAddArtistModalOpen && (
				<AddArtistModal
					artistsDictionnary={artistsDictionnary}
					setIsOpen={setIsAddArtistmodalOpen}
					updateArtistsState={updateArtistsState}
				/>
			)}
			{isAddGenreDisplayTextModalOpen && (
				<AddGenreDisplayTextModal
					selectedGenre={selectedGenre}
					setIsOpen={setIsAddGenreDisplayTextModalOpen}
					updateGenresState={updateGenresState}
				/>
			)}
			{isAddSuggestedArtistModalOpen && (
				<AddSuggestedArtistModal
					selectedSuggestedArtist={selectedSuggestedArtist}
					setIsOpen={setIsAddSuggestedArtistModalOpen}
					updateArtistsState={updateArtistsState}
				/>
			)}
		</>
	);
};

const artistCardStyle = css`
	text-align: center;
	${centeredColumnStyle}
`;

const paddedButtonStyle = css`
	margin: 0 4px;
	${mdButtonStyle}
`;

const warningGenreStyle = css`
	color: ${warningColor};
`;

const StyledA = styled.div`
	font-weight: 900;
	color: ${getQualityGradientColor(75)};
`;

const StyledArtistCard = styled.div`
	margin: 4px;
	width: 160px;
	${artistCardStyle}
`;

const StyledB = styled.div`
	font-weight: 900;
	color: ${getQualityGradientColor(50)};
`;

const StyledC = styled.div`
	font-weight: 900;
	color: ${getQualityGradientColor(25)};
`;

const StyledD = styled.div`
	font-weight: 900;
	color: ${getQualityGradientColor(0)};
`;

const StyledDetailedArtist = styled.div`
	padding-left: 16px;
`;

const StyledGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: start;
	margin: 32px 0;
`;

const StyledList = styled.div`
	margin: 28px 0;
	${centeredColumnStyle}
`;

const StyledListElement = styled.div`
	align-items: center;
	display: flex;
	padding: 16px 32px;
`;

const StyledPaddedDash = styled.div`
	padding: 4px;
`;
const StyledRow = styled.div`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
`;

const StyledS = styled.div`
	font-weight: 900;
	color: ${getQualityGradientColor(100)};
`;

const StyledScoresColumn = styled.div`
	padding-right: 16px;
	text-align: center;
`;

const StyledScoresDurationColumn = styled.div`
	padding-right: 16px;
	text-align: start;
`;

const StyledScoresGrid = styled.div`
	align-items: end;
	display: flex;
	padding-top: 16px;
`;

const StyledScoresLabel = styled.div`
	padding-right: 16px;
	text-align: end;
`;

const StyledSuggestedArtistCard = styled.div`
	margin: 8px 12px;
	width: 128px;
	${artistCardStyle}
`;

const StyledSuggestedArtistPicture = styled.img`
	border-radius: 64px;
	height: 128px;
	width: 128px;
	${musicArtistPictureStyle}
`;

const StyledScore = styled.div<{ scoreColor?: string | undefined }>`
	color: ${(props) => props.scoreColor};
	${h2Style};
	padding-bottom: 0;
`;

const StylesScoreContainer = styled.div`
	padding: 0 16px;
	${centeredColumnStyle}
`;
