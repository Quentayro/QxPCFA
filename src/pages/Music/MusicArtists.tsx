import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, RouterLink } from 'components';
import { AddArtistModal, AddGenreDisplayTextModal, AddSuggestedArtistModal } from 'pages/Music/components';
import { getQualityGradientColor, pushedColor, warningColor } from 'utils/colors';
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
	nameText,
	originalDurationText,
	originalScoreText,
	originalTitlesText,
	originalTracksNumberText,
	remixText,
	sText,
	simplifiedViewText,
	sortText,
	suggestionsText,
	totalDurationText,
	totalScoreText,
	totalText,
	totalTracksNumberText
} from 'utils/texts';
import type { BooleanDictionnaryType, MusicArtistType, MusicGenreType, StringDictionnaryType } from 'utils/types';
import { h2Style } from 'utils/styles';
import { clickToActionStyle } from 'utils/styles';

export const MusicArtists = () => {
	// TASK : Handle first rank date
	// TASK : Handle update date
	// TASK : Display related artists for suggested artists
	// TASK : Filters
	// TASK : Better HTML/CSS structure
	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [areArtistsDetailed, setAreArtistsDetailed] = useState(false);
	const [areSuggestedArtistsDetailed, setAreSuggestedArtistsDetailed] = useState(false);
	const [artists, setArtists] = useState<MusicArtistType[]>([]);
	const [artistsDictionnary, setArtistsDictionnary] = useState<BooleanDictionnaryType>({});
	const [genresDictionnary, setGenresDictionnary] = useState<StringDictionnaryType>({});
	const [isAddArtistModalOpen, setIsAddArtistmodalOpen] = useState(false);
	const [isAddGenreDisplayTextModalOpen, setIsAddGenreDisplayTextModalOpen] = useState(false);
	const [isAddSuggestedArtistModalOpen, setIsAddSuggestedArtistModalOpen] = useState(false);
	const [isSortArtistByNameButtonDisabled, setIsSortArtistByNameButtonDisabled] = useState(false);
	const [isSortArtistByOriginalScoreButtonDisabled, setIsSortArtistByOriginalScoreButtonDisabled] = useState(false);
	const [isSortArtistByOriginalTracksDurationButtonDisabled, setIsSortArtistByOriginalTracksDurationButtonDisabled] =
		useState(false);
	const [isSortArtistByOriginalTracksNumberButtonDisabled, setIsSortArtistByOriginalTracksNumberButtonDisabled] =
		useState(false);
	const [isSortArtistByTotalScoreButtonDisabled, setIsSortArtistByTotalScoreButtonDisabled] = useState(false);
	const [isSortArtistByTotalTracksDurationButtonDisabled, setIsSortArtistByTotalTracksDurationButtonDisabled] =
		useState(false);
	const [isSortArtistByTotalTracksNumberButtonDisabled, setIsSortArtistByTotalTracksNumberButtonDisabled] =
		useState(false);
	const [isSortSuggestedArtistByNameButtonDisabled, setIsSortSuggestedArtistByNameButtonDisabled] = useState(false);
	const [isSortSuggestedArtistByOriginalScoreButtonDisabled, setIsSortSuggestedArtistByOriginalScoreButtonDisabled] =
		useState(false);
	const [
		isSortSuggestedArtistByOriginalTracksNumberButtonDisabled,
		setIsSortSuggestedArtistByOriginalTracksNumberButtonDisabled
	] = useState(false);
	const [isSortSuggestedArtistByTotalScoreButtonDisabled, setIsSortSuggestedArtistByTotalScoreButtonDisabled] =
		useState(false);
	const [
		isSortSuggestedArtistByTotalTracksNumberButtonDisabled,
		setIsSortSuggestedArtistByTotalTracksNumberButtonDisabled
	] = useState(false);
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

	const ableAllArtistsSortButtons = (isSuggestions?: boolean | undefined) => {
		if (isSuggestions) {
			setIsSortSuggestedArtistByNameButtonDisabled(false);
			setIsSortSuggestedArtistByOriginalScoreButtonDisabled(false);
			setIsSortSuggestedArtistByOriginalTracksNumberButtonDisabled(false);
			setIsSortSuggestedArtistByTotalScoreButtonDisabled(false);
			setIsSortSuggestedArtistByTotalTracksNumberButtonDisabled(false);
		} else {
			setIsSortArtistByNameButtonDisabled(false);
			setIsSortArtistByOriginalScoreButtonDisabled(false);
			setIsSortArtistByOriginalTracksDurationButtonDisabled(false);
			setIsSortArtistByOriginalTracksNumberButtonDisabled(false);
			setIsSortArtistByTotalScoreButtonDisabled(false);
			setIsSortArtistByTotalTracksDurationButtonDisabled(false);
			setIsSortArtistByTotalTracksNumberButtonDisabled(false);
		}
	};

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

	const renderSimplifiedArtistLegend = (artist: MusicArtistType) =>
		!isSortArtistByNameButtonDisabled &&
		(isSortArtistByOriginalScoreButtonDisabled ? (
			<StyledScoreLegend scoreColor={getQualityGradientColor(artist.originalScore)}>
				{`${Math.round(artist.originalScore)} %`}
			</StyledScoreLegend>
		) : isSortArtistByTotalScoreButtonDisabled ? (
			<StyledScoreLegend scoreColor={getQualityGradientColor(artist.totalScore)}>
				{`${Math.round(artist.totalScore)} %`}
			</StyledScoreLegend>
		) : (
			<>
				{isSortArtistByOriginalTracksDurationButtonDisabled
					? msDurationToDisplayDuration(artist.originalTracksDuration)
					: isSortArtistByOriginalTracksNumberButtonDisabled
					? artist.originalTracksNumber
					: isSortArtistByTotalTracksDurationButtonDisabled
					? msDurationToDisplayDuration(artist.totalTracksDuration)
					: artist.totalTracksNumber}
			</>
		));

	const renderSimplifiedSuggestedArtistLegend = (artist: MusicArtistType) => {
		if (
			isSortSuggestedArtistByOriginalTracksNumberButtonDisabled ||
			isSortSuggestedArtistByTotalTracksNumberButtonDisabled ||
			isSortSuggestedArtistByTotalScoreButtonDisabled
		) {
			return isSortSuggestedArtistByTotalScoreButtonDisabled ? (
				<StyledScoreLegend scoreColor={getQualityGradientColor(artist.totalScore)}>
					{`${Math.round(artist.totalScore)} %`}
				</StyledScoreLegend>
			) : (
				<>
					{isSortSuggestedArtistByOriginalTracksNumberButtonDisabled
						? artist.originalTracksNumber
						: artist.totalTracksNumber}
				</>
			);
		} else {
			return;
		}
	};

	const sortArtistsByName = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		isSuggestions?: boolean | undefined
	) => {
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.name.toLowerCase() < artist1.name.toLowerCase() ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons(isSuggestions);
		!isSuggestions ? setIsSortArtistByNameButtonDisabled(true) : setIsSortSuggestedArtistByNameButtonDisabled(true);
	};

	const sortArtistsByOriginalScore = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		isSuggestions?: boolean | undefined
	) => {
		sortArtistsByName(artists, setArtists, isSuggestions);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.originalScore > artist1.originalScore ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons(isSuggestions);
		!isSuggestions
			? setIsSortArtistByOriginalScoreButtonDisabled(true)
			: setIsSortSuggestedArtistByOriginalScoreButtonDisabled(true);
	};

	const sortArtistsByOriginalTracksDuration = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>
	) => {
		sortArtistsByName(artists, setArtists);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.originalTracksDuration > artist1.originalTracksDuration ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons();
		setIsSortArtistByOriginalTracksDurationButtonDisabled(true);
	};

	const sortArtistsByOriginalTracksNumber = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		isSuggestions?: boolean | undefined
	) => {
		sortArtistsByName(artists, setArtists, isSuggestions);
		isSuggestions && sortArtistsByOriginalScore(artists, setArtists, isSuggestions);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.originalTracksNumber > artist1.originalTracksNumber ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons(isSuggestions);
		!isSuggestions
			? setIsSortArtistByOriginalTracksNumberButtonDisabled(true)
			: setIsSortSuggestedArtistByOriginalTracksNumberButtonDisabled(true);
	};

	const sortArtistsByTotalScore = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		isSuggestions?: boolean | undefined
	) => {
		sortArtistsByName(artists, setArtists, isSuggestions);
		isSuggestions && sortArtistsByOriginalScore(artists, setArtists, isSuggestions);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.totalScore > artist1.totalScore ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons(isSuggestions);
		!isSuggestions
			? setIsSortArtistByTotalScoreButtonDisabled(true)
			: setIsSortSuggestedArtistByTotalScoreButtonDisabled(true);
	};

	const sortArtistsByTotalTracksDuration = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>
	) => {
		sortArtistsByName(artists, setArtists);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.totalTracksDuration > artist1.totalTracksDuration ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons();
		setIsSortArtistByTotalTracksDurationButtonDisabled(true);
	};

	const sortArtistsByTotalTracksNumber = (
		artists: MusicArtistType[],
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		isSuggestions?: boolean | undefined
	) => {
		sortArtistsByName(artists, setArtists, isSuggestions);
		isSuggestions && sortArtistsByOriginalScore(artists, setArtists, isSuggestions);
		const sortedArtists = [...artists];
		sortedArtists.sort((artist0: MusicArtistType, artist1: MusicArtistType) => {
			return artist0.totalTracksNumber > artist1.totalTracksNumber ? -1 : 1;
		});
		setArtists(sortedArtists);
		ableAllArtistsSortButtons(isSuggestions);
		!isSuggestions
			? setIsSortArtistByTotalTracksNumberButtonDisabled(true)
			: setIsSortSuggestedArtistByTotalTracksNumberButtonDisabled(true);
	};

	const switchArtistView = () => setAreArtistsDetailed(!areArtistsDetailed);

	const switchSuggestedArtistView = () => setAreSuggestedArtistsDetailed(!areSuggestedArtistsDetailed);

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

		sortArtistsByName(artists, setArtists);
		sortArtistsByName(suggestedArtists, setSuggestedArtists, true);
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
			<StyledButtonsRow>
				<StyledSortLabel>{sortText}</StyledSortLabel>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByNameButtonDisabled}
					onClick={() => {
						sortArtistsByName(artists, setArtists);
					}}
				>
					{nameText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalTracksDurationButtonDisabled}
					onClick={() => {
						sortArtistsByOriginalTracksDuration(artists, setArtists);
					}}
				>
					{originalDurationText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalTracksNumberButtonDisabled}
					onClick={() => {
						sortArtistsByOriginalTracksNumber(artists, setArtists);
					}}
				>
					{originalTracksNumberText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalScoreButtonDisabled}
					onClick={() => {
						sortArtistsByOriginalScore(artists, setArtists);
					}}
				>
					{originalScoreText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalTracksDurationButtonDisabled}
					onClick={() => {
						sortArtistsByTotalTracksDuration(artists, setArtists);
					}}
				>
					{totalDurationText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalTracksNumberButtonDisabled}
					onClick={() => {
						sortArtistsByTotalTracksNumber(artists, setArtists);
					}}
				>
					{totalTracksNumberText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalScoreButtonDisabled}
					onClick={() => {
						sortArtistsByTotalScore(artists, setArtists);
					}}
				>
					{totalScoreText}
				</Button>
			</StyledButtonsRow>
			{areArtistsDetailed ? (
				<div>
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
								<StyledScoresContainer>
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
								</StyledScoresContainer>
							</StyledDetailedArtist>
						</StyledListElement>
					))}
				</div>
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
								<div>{artist.name}</div>
								{renderSimplifiedArtistLegend(artist)}
							</StyledArtistCard>
						</RouterLink>
					))}
				</StyledGrid>
			)}

			<StyledH2>{suggestionsText}</StyledH2>
			<Button
				customStyle={extraPaddedButtonStyle}
				onClick={switchSuggestedArtistView}
			>
				{areSuggestedArtistsDetailed ? simplifiedViewText : detailedViewText}
			</Button>
			<StyledButtonsRow>
				<StyledSortLabel>{sortText}</StyledSortLabel>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByNameButtonDisabled}
					onClick={() => {
						sortArtistsByName(suggestedArtists, setSuggestedArtists, true);
					}}
				>
					{nameText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByOriginalTracksNumberButtonDisabled}
					onClick={() => {
						sortArtistsByOriginalTracksNumber(suggestedArtists, setSuggestedArtists, true);
					}}
				>
					{originalTracksNumberText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByOriginalScoreButtonDisabled}
					onClick={() => {
						sortArtistsByOriginalScore(suggestedArtists, setSuggestedArtists, true);
					}}
				>
					{originalScoreText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByTotalTracksNumberButtonDisabled}
					onClick={() => {
						sortArtistsByTotalTracksNumber(suggestedArtists, setSuggestedArtists, true);
					}}
				>
					{totalTracksNumberText}
				</Button>
				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByTotalScoreButtonDisabled}
					onClick={() => {
						sortArtistsByTotalScore(suggestedArtists, setSuggestedArtists, true);
					}}
				>
					{totalScoreText}
				</Button>
			</StyledButtonsRow>
			{
				<StyledGrid>
					{!areSuggestedArtistsDetailed ? (
						suggestedArtists.map((artist: MusicArtistType) => (
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
									<div>
										<>{`${artist.name}${
											!isSortSuggestedArtistByTotalScoreButtonDisabled && ' -'
										}`}</>
										{!isSortSuggestedArtistByTotalScoreButtonDisabled && (
											<StyledScoreLegend
												scoreColor={getQualityGradientColor(artist.originalScore)}
											>
												{`${Math.round(artist.originalScore)} %`}
											</StyledScoreLegend>
										)}
									</div>
									{renderSimplifiedSuggestedArtistLegend(artist)}
								</StyledSuggestedArtistCard>
							</Button>
						))
					) : (
						<div>
							{suggestedArtists.map((artist: MusicArtistType) => (
								<StyledListElement key={artist.id}>
									<StyledSuggestedArtistPicture
										src={`${spotifyPictureUrlPrefix}${
											artist.picture ? artist.picture : musicPicturePlaceHolder
										}`}
										alt={`${artist.name} picture`}
									/>
									<StyledDetailedArtist>
										<Button
											customStyle={nonPaddedH2Style}
											onClick={() => {
												openAddSuggestedArtistModal(artist);
											}}
										>
											{artist.name}
										</Button>
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
										<div>{`${originalTitlesText} : ${artist.originalTracksNumber}`}</div>
										<div>{`${remixText} : ${artist.remixTracksNumber}`}</div>
										<div>{`${totalText} : ${artist.totalTracksNumber}`}</div>
										<StyledScoresContainer>
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
										</StyledScoresContainer>
									</StyledDetailedArtist>
								</StyledListElement>
							))}
						</div>
					)}
				</StyledGrid>
			}
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

const extraPaddedButtonStyle = css`
	margin-top: 16px;
	${mdButtonStyle}
`;

const nonPaddedH2Style = css`
	${h2Style}
	padding: 0;
`;

const paddedButtonStyle = css`
	margin: 0 4px;
	${mdButtonStyle}
`;

const sortButtonStyle = css`
	border: 2px solid;
	border-radius: 4px;
	margin: 2px;
	padding: 4px 16px;
	${clickToActionStyle}
	&:disabled {
		color: ${pushedColor};
	}
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

const StyledListElement = styled.div`
	align-items: center;
	display: flex;
	padding: 16px 32px;
`;

const StyledPaddedDash = styled.div`
	padding: 4px;
`;

const StyledScoresContainer = styled.div`
	display: flex;
`;

const StyledRow = styled.div`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 4px;
`;

const StyledButtonsRow = styled(StyledRow)`
	margin-top: 14px;
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
	white-space: nowrap;
`;

const StyledScoresGrid = styled.div`
	align-items: end;
	display: flex;
	padding-top: 8px;
`;

const StyledScoresLabel = styled.div`
	padding-right: 16px;
	text-align: end;
	white-space: nowrap;
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

const StyledScoreLegend = styled.span<{ scoreColor?: string | undefined }>`
	margin-left: 4px;
	white-space: nowrap;
	color: ${(props) => props.scoreColor};
`;

const StylesScoreContainer = styled.div`
	padding-left: 64px;
	${centeredColumnStyle}
`;

const StyledSortLabel = styled.div`
	font-weight: 700;
	margin-right: 8px;
`;
