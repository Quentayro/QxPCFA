import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { Button, RouterLink } from 'components';
import { AddArtistModal, AddGenreDisplayTextModal, AddSuggestedArtistModal } from 'pages/Music/components';
import { getQualityGradientColor, pushedColor, warningColor } from 'utils/colors';
import { spotifyPictureUrlPlaceholder, spotifyPictureUrlPrefix } from 'utils/constants';
import { Context } from 'utils/context';
import { getMusicArtistsEndpoint } from 'utils/endpoints';
import { musicArtistsPath } from 'utils/paths';
import {
	clickToActionStyle,
	h2Style,
	mdButtonStyle,
	musicArtistPictureStyle,
	StyledCenteredColumn,
	StyledCenteredDiv,
	StyledH1,
	StyledH2,
	StyledMusicArtistPicture,
	unpaddedH2Style
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

export const MusicArtists = () => {
	// TASK : Handle first rank date
	// TASK : Handle update date
	// TASK : Display related artists for suggested artists
	// TASK : Filters
	const context = useContext(Context);
	const { openErrorNotification } = context;

	const [artists, setArtists] = useState<MusicArtistType[]>([]);
	const [artistsDictionnary, setArtistsDictionnary] = useState<BooleanDictionnaryType>({});
	const [genresDictionnary, setGenresDictionnary] = useState<StringDictionnaryType>({});
	const [isAddArtistModalOpen, setIsAddArtistmodalOpen] = useState(false);
	const [isAddGenreDisplayTextModalOpen, setIsAddGenreDisplayTextModalOpen] = useState(false);
	const [isAddSuggestedArtistModalOpen, setIsAddSuggestedArtistModalOpen] = useState(false);
	const [isArtistsSimplifiedViewRendered, setIsArtistsSimplifiedViewRendered] = useState(true);
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
	const [isSuggestedArtistsSimplifiedViewRendered, setIsSuggestedArtistsSimplifiedViewRendered] = useState(true);
	const [selectedGenre, setSelectedGenre] = useState('');
	const [selectedSuggestedArtist, setSelectedSuggestedArtist] = useState<MusicArtistType>();
	const [suggestedArtists, setSuggestedArtists] = useState<MusicArtistType[]>([]);

	useEffect(() => {
		requestGetArtists();
	}, []);

	const disableAllArtistsSortButtons = () => {
		setIsSortArtistByNameButtonDisabled(false);
		setIsSortArtistByOriginalScoreButtonDisabled(false);
		setIsSortArtistByOriginalTracksDurationButtonDisabled(false);
		setIsSortArtistByOriginalTracksNumberButtonDisabled(false);
		setIsSortArtistByTotalScoreButtonDisabled(false);
		setIsSortArtistByTotalTracksDurationButtonDisabled(false);
		setIsSortArtistByTotalTracksNumberButtonDisabled(false);
	};

	const disableAllSuggestedArtistsSortButtons = () => {
		setIsSortSuggestedArtistByNameButtonDisabled(false);
		setIsSortSuggestedArtistByOriginalScoreButtonDisabled(false);
		setIsSortSuggestedArtistByOriginalTracksNumberButtonDisabled(false);
		setIsSortSuggestedArtistByTotalScoreButtonDisabled(false);
		setIsSortSuggestedArtistByTotalTracksNumberButtonDisabled(false);
	};

	const msDurationToDisplayDuration = (msDuration: number) => {
		const hDuration = Math.floor(msDuration / 3600000);
		const minDuration = Math.floor((msDuration - hDuration * 3600000) / 60000);

		return `${hDuration} ${abbreviatedHourText} ${minDuration} ${abbreviatedMinuteText}`;
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

	const renderArtistsSimplifiedView = () => (
		<StyledGrid>
			{artists.map((artist: MusicArtistType) => (
				<RouterLink
					key={artist.id}
					to={musicArtistsPath}
				>
					<StyledArtistCard>
						<StyledMusicArtistPicture
							src={`${spotifyPictureUrlPrefix}${
								artist.picture ? artist.picture : spotifyPictureUrlPlaceholder
							}`}
							alt={`${artist.name} picture`}
						/>
						<div>{artist.name}</div>
						{renderSimplifiedArtistLegend(artist)}
					</StyledArtistCard>
				</RouterLink>
			))}
		</StyledGrid>
	);

	const renderArtistsDetailedView = () => {
		return (
			<StyledList>
				{artists.map((artist: MusicArtistType) => (
					<StyledListElement key={artist.id}>
						<StyledMarginedArtistPicture
							src={`${spotifyPictureUrlPrefix}${
								artist.picture ? artist.picture : spotifyPictureUrlPlaceholder
							}`}
							alt={`${artist.name} picture`}
						/>

						<StyledAlignedColumn>
							<RouterLink
								customStyle={paddedH2Style}
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
										{index !== artist.genres.length - 1 && <StyledPaddedDash>-</StyledPaddedDash>}
									</StyledRow>
								))}
							</StyledRow>

							<StyledTable>
								<StyledLabelColumn>
									<div>{originalTitlesText}</div>
									<div>{remixText}</div>
									<div>{totalText}</div>
								</StyledLabelColumn>

								<StyledScoresColumn>
									<StyledTierLabel score={100}>{sText}</StyledTierLabel>
									<div>{artist.originalSNumber}</div>
									<div>{artist.remixSNumber}</div>
									<div>{artist.totalSNumber}</div>
								</StyledScoresColumn>

								<StyledScoresColumn>
									<StyledTierLabel score={75}>{aText}</StyledTierLabel>
									<div>{artist.originalANumber}</div>
									<div>{artist.remixANumber}</div>
									<div>{artist.totalANumber}</div>
								</StyledScoresColumn>

								<StyledScoresColumn>
									<StyledTierLabel score={50}>{bText}</StyledTierLabel>
									<div>{artist.originalBNumber}</div>
									<div>{artist.remixBNumber}</div>
									<div>{artist.totalBNumber}</div>
								</StyledScoresColumn>

								<StyledScoresColumn>
									<StyledTierLabel score={25}>{cText}</StyledTierLabel>
									<div>{artist.originalCNumber}</div>
									<div>{artist.remixCNumber}</div>
									<div>{artist.totalCNumber}</div>
								</StyledScoresColumn>

								<StyledScoresColumn>
									<StyledTierLabel score={0}>{dText}</StyledTierLabel>
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

								<StyledColumn>
									<div>{durationText}</div>
									<div>{msDurationToDisplayDuration(artist.originalTracksDuration)}</div>
									<div>{msDurationToDisplayDuration(artist.remixTracksDuration)}</div>
									<div>{msDurationToDisplayDuration(artist.totalTracksDuration)}</div>
								</StyledColumn>
							</StyledTable>

							<StyledCenteredDiv>
								<StyledCenteredColumn>
									<StyledScore score={artist.originalScore}>
										{`${Math.round(artist.originalScore)} %`}
									</StyledScore>
									<div>{originalScoreText}</div>
								</StyledCenteredColumn>

								<StyledCenteredColumn>
									<StyledScore score={artist.totalScore}>
										{`${Math.round(artist.totalScore)} %`}
									</StyledScore>
									<div>{totalScoreText}</div>
								</StyledCenteredColumn>
							</StyledCenteredDiv>
						</StyledAlignedColumn>
					</StyledListElement>
				))}
			</StyledList>
		);
	};

	const renderSimplifiedArtistLegend = (artist: MusicArtistType) =>
		!isSortArtistByNameButtonDisabled &&
		(isSortArtistByOriginalScoreButtonDisabled ? (
			<StyledScoreLegend score={artist.originalScore}>
				{`${Math.round(artist.originalScore)} %`}
			</StyledScoreLegend>
		) : isSortArtistByTotalScoreButtonDisabled ? (
			<StyledScoreLegend score={artist.totalScore}>{`${Math.round(artist.totalScore)} %`}</StyledScoreLegend>
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
				<StyledScoreLegend score={artist.totalScore}>{`${Math.round(artist.totalScore)} %`}</StyledScoreLegend>
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

	const renderSuggestedArtistsDetailedView = () => {
		return (
			<StyledList>
				{suggestedArtists.map((artist: MusicArtistType) => (
					<StyledListElement key={artist.id}>
						<StyledMarginedSuggestedArtistPicture
							src={`${spotifyPictureUrlPrefix}${
								artist.picture ? artist.picture : spotifyPictureUrlPlaceholder
							}`}
							alt={`${artist.name} picture`}
						/>

						<StyledAlignedColumn>
							<Button
								customStyle={unpaddedH2Style}
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
										{index !== artist.genres.length - 1 && <StyledPaddedDash>-</StyledPaddedDash>}
									</StyledRow>
								))}
							</StyledRow>

							<StyledStats>{`${originalTitlesText} : ${artist.originalTracksNumber}`}</StyledStats>
							<div>{`${remixText} : ${artist.remixTracksNumber}`}</div>
							<div>{`${totalText} : ${artist.totalTracksNumber}`}</div>

							<StyledCenteredDiv>
								<StyledCenteredColumn>
									<StyledScore score={artist.originalScore}>
										{`${Math.round(artist.originalScore)} %`}
									</StyledScore>
									<div>{originalScoreText}</div>
								</StyledCenteredColumn>

								<StyledCenteredColumn>
									<StyledScore score={artist.totalScore}>
										{`${Math.round(artist.totalScore)} %`}
									</StyledScore>
									<div>{totalScoreText}</div>
								</StyledCenteredColumn>
							</StyledCenteredDiv>
						</StyledAlignedColumn>
					</StyledListElement>
				))}
			</StyledList>
		);
	};

	const renderSuggestedArtistsSimplifiedView = () => (
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
								artist.picture ? artist.picture : spotifyPictureUrlPlaceholder
							}`}
							alt={`${artist.name} picture`}
						/>
						<StyledCenteredDiv>
							<>{artist.name}</>
							{!isSortSuggestedArtistByTotalScoreButtonDisabled && (
								<StyledCenteredDiv>
									<StyledPaddedDash>-</StyledPaddedDash>
									<StyledScoreLegend score={artist.originalScore}>
										{`${Math.round(artist.originalScore)} %`}
									</StyledScoreLegend>
								</StyledCenteredDiv>
							)}
						</StyledCenteredDiv>
						{renderSimplifiedSuggestedArtistLegend(artist)}
					</StyledSuggestedArtistCard>
				</Button>
			))}
		</StyledGrid>
	);

	const requestGetArtists = async () => {
		try {
			const response = await axios.get(getMusicArtistsEndpoint);
			updateArtistsStates(response);
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

	const sortArtistsByName = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			sortArtistsByNameSystem
		);

	const sortArtistsByNameSystem = (artists: MusicArtistType[]) =>
		artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
			artist0.name.toLowerCase() < artist1.name.toLowerCase() ? -1 : 1
		);

	const sortArtistsByOriginalScore = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.originalScore > artist1.originalScore ? -1 : 1
				);
			}
		);

	const sortArtistsByOriginalTracksDuration = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.originalTracksDuration > artist1.originalTracksDuration ? -1 : 1
				);
			}
		);

	const sortArtistsByOriginalTracksNumber = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.originalTracksNumber > artist1.originalTracksNumber ? -1 : 1
				);
			}
		);

	const sortArtistsBySortSystem = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>,
		sortSystem: (artists: MusicArtistType[]) => void
	) => {
		const sortedArtists = [...artists];
		sortSystem(sortedArtists);
		setArtists(sortedArtists);
		disableAllSortButtons();
		setIsButtonDisabled(true);
	};

	const sortArtistsByTotalScore = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.totalScore > artist1.totalScore ? -1 : 1
				);
			}
		);

	const sortArtistsByTotalTracksDuration = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.totalTracksDuration > artist1.totalTracksDuration ? -1 : 1
				);
			}
		);

	const sortArtistsByTotalTracksNumber = (
		artists: MusicArtistType[],
		disableAllSortButtons: () => void,
		setArtists: React.Dispatch<React.SetStateAction<MusicArtistType[]>>,
		setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
	) =>
		sortArtistsBySortSystem(
			artists,
			disableAllSortButtons,
			setArtists,
			setIsButtonDisabled,
			(artists: MusicArtistType[]) => {
				sortArtistsByNameSystem(artists);
				artists.sort((artist0: MusicArtistType, artist1: MusicArtistType) =>
					artist0.totalTracksNumber > artist1.totalTracksNumber ? -1 : 1
				);
			}
		);

	const switchArtistView = () => setIsArtistsSimplifiedViewRendered(!isArtistsSimplifiedViewRendered);

	const switchSuggestedArtistView = () =>
		setIsSuggestedArtistsSimplifiedViewRendered(!isSuggestedArtistsSimplifiedViewRendered);

	const updateArtistsStates = (response: AxiosResponse<any, any>) => {
		const { artists, genres, suggestedArtists } = response.data;
		setArtists(artists);
		setSuggestedArtists(suggestedArtists);

		const initialArtistsDictionnary: BooleanDictionnaryType = {};
		for (const artist of artists) {
			initialArtistsDictionnary[artist.spotifyId] = true;
		}
		setArtistsDictionnary(initialArtistsDictionnary);

		updateGenresState(genres);

		sortArtistsByName(artists, disableAllArtistsSortButtons, setArtists, setIsSortArtistByNameButtonDisabled);
		sortArtistsByOriginalScore(
			suggestedArtists,
			disableAllSuggestedArtistsSortButtons,
			setSuggestedArtists,
			setIsSortSuggestedArtistByOriginalScoreButtonDisabled
		);
	};

	const updateGenresState = (genres: MusicGenreType[]) => {
		const initialGenresDictionnary: StringDictionnaryType = {};
		for (const genre of genres) {
			const { displayText, spotifyId } = genre;
			initialGenresDictionnary[spotifyId] = displayText;
		}
		setGenresDictionnary(initialGenresDictionnary);
	};

	return (
		<>
			<StyledH1>{artistsText}</StyledH1>

			<StyledCenteredDiv>
				<Button
					customStyle={marginedButtonStyle}
					onClick={openAddArtistModal}
				>
					{addArtistText}
				</Button>

				<Button
					customStyle={marginedButtonStyle}
					onClick={switchArtistView}
				>
					{isArtistsSimplifiedViewRendered ? detailedViewText : simplifiedViewText}
				</Button>
			</StyledCenteredDiv>

			<StyledMarginedRow>
				<StyledSortLabel>{sortText}</StyledSortLabel>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByNameButtonDisabled}
					onClick={() => {
						sortArtistsByName(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByNameButtonDisabled
						);
					}}
				>
					{nameText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalTracksDurationButtonDisabled}
					onClick={() =>
						sortArtistsByOriginalTracksDuration(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByOriginalTracksDurationButtonDisabled
						)
					}
				>
					{originalDurationText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalTracksNumberButtonDisabled}
					onClick={() =>
						sortArtistsByOriginalTracksNumber(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByOriginalTracksNumberButtonDisabled
						)
					}
				>
					{originalTracksNumberText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByOriginalScoreButtonDisabled}
					onClick={() =>
						sortArtistsByOriginalScore(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByOriginalScoreButtonDisabled
						)
					}
				>
					{originalScoreText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalTracksDurationButtonDisabled}
					onClick={() =>
						sortArtistsByTotalTracksDuration(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByTotalTracksDurationButtonDisabled
						)
					}
				>
					{totalDurationText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalTracksNumberButtonDisabled}
					onClick={() =>
						sortArtistsByTotalTracksNumber(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByTotalTracksNumberButtonDisabled
						)
					}
				>
					{totalTracksNumberText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortArtistByTotalScoreButtonDisabled}
					onClick={() =>
						sortArtistsByTotalScore(
							artists,
							disableAllArtistsSortButtons,
							setArtists,
							setIsSortArtistByTotalScoreButtonDisabled
						)
					}
				>
					{totalScoreText}
				</Button>
			</StyledMarginedRow>

			{isArtistsSimplifiedViewRendered ? renderArtistsSimplifiedView() : renderArtistsDetailedView()}

			<StyledH2>{suggestionsText}</StyledH2>

			<Button
				customStyle={suggestedArtistViewStyle}
				onClick={switchSuggestedArtistView}
			>
				{isSuggestedArtistsSimplifiedViewRendered ? detailedViewText : simplifiedViewText}
			</Button>

			<StyledMarginedRow>
				<StyledSortLabel>{sortText}</StyledSortLabel>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByNameButtonDisabled}
					onClick={() => {
						sortArtistsByName(
							suggestedArtists,
							disableAllSuggestedArtistsSortButtons,
							setSuggestedArtists,
							setIsSortSuggestedArtistByNameButtonDisabled
						);
					}}
				>
					{nameText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByOriginalTracksNumberButtonDisabled}
					onClick={() =>
						sortArtistsByOriginalTracksNumber(
							suggestedArtists,
							disableAllSuggestedArtistsSortButtons,
							setSuggestedArtists,
							setIsSortSuggestedArtistByOriginalTracksNumberButtonDisabled
						)
					}
				>
					{originalTracksNumberText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByOriginalScoreButtonDisabled}
					onClick={() =>
						sortArtistsByOriginalScore(
							suggestedArtists,
							disableAllSuggestedArtistsSortButtons,
							setSuggestedArtists,
							setIsSortSuggestedArtistByOriginalScoreButtonDisabled
						)
					}
				>
					{originalScoreText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByTotalTracksNumberButtonDisabled}
					onClick={() =>
						sortArtistsByTotalTracksNumber(
							suggestedArtists,
							disableAllSuggestedArtistsSortButtons,
							setSuggestedArtists,
							setIsSortSuggestedArtistByTotalTracksNumberButtonDisabled
						)
					}
				>
					{totalTracksNumberText}
				</Button>

				<Button
					customStyle={sortButtonStyle}
					isButtonDisabled={isSortSuggestedArtistByTotalScoreButtonDisabled}
					onClick={() =>
						sortArtistsByTotalScore(
							suggestedArtists,
							disableAllSuggestedArtistsSortButtons,
							setSuggestedArtists,
							setIsSortSuggestedArtistByTotalScoreButtonDisabled
						)
					}
				>
					{totalScoreText}
				</Button>
			</StyledMarginedRow>

			{isSuggestedArtistsSimplifiedViewRendered
				? renderSuggestedArtistsSimplifiedView()
				: renderSuggestedArtistsDetailedView()}

			{isAddArtistModalOpen && (
				<AddArtistModal
					artistsDictionnary={artistsDictionnary}
					setIsOpen={setIsAddArtistmodalOpen}
					updateArtistsStates={updateArtistsStates}
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
					artist={selectedSuggestedArtist}
					setIsOpen={setIsAddSuggestedArtistModalOpen}
					updateArtistsStates={updateArtistsStates}
				/>
			)}
		</>
	);
};

const marginedButtonStyle = css`
	margin: 0 8px 16px 0;
	${mdButtonStyle};
`;

const paddedH2Style = css`
	${unpaddedH2Style}
	margin-top: 8px;
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

const suggestedArtistViewStyle = css`
	margin: 16px 0;
	${mdButtonStyle};
`;

const warningGenreStyle = css`
	color: ${warningColor};
`;

const StyledArtistCard = styled(StyledCenteredColumn)`
	margin: 4px;
	width: 160px;
	text-align: center;
`;

const StyledColumn = styled.div`
	display: flex;
	flex-direction: column;
`;

const StyledAlignedColumn = styled(StyledColumn)`
	align-items: start;
`;

const StyledGrid = styled.div`
	align-items: start;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin-bottom: 32px;
`;

const StyledPaddedColumn = styled(StyledColumn)`
	margin-right: 12px;
`;

const StyledScoresColumn = styled(StyledPaddedColumn)`
	align-items: center;
`;

const StyledSuggestedArtistCard = styled(StyledCenteredColumn)`
	margin: 0 8px 12px;
	width: 128px;
	text-align: center;
`;

const StyledSuggestedArtistPicture = styled.img`
	border-radius: 64px;
	height: 128px;
	width: 128px;
	${musicArtistPictureStyle}
`;

const StyledLabelColumn = styled(StyledPaddedColumn)`
	text-align: end;
`;

const StyledList = styled(StyledAlignedColumn)`
	margin: 0 32px;
`;

const StyledListElement = styled(StyledCenteredDiv)`
	margin-bottom: 32px;
`;

const StyledMarginedArtistPicture = styled(StyledMusicArtistPicture)`
	margin-right: 16px;
`;

const StyledMarginedSuggestedArtistPicture = styled(StyledSuggestedArtistPicture)`
	margin-right: 16px;
`;

const StyledPaddedDash = styled.div`
	padding: 0 4px;
`;

const StyledRow = styled.div`
	align-items: center;
	display: flex;
	flex-wrap: wrap;
`;

const StyledStats = styled.div`
	margin-top: 8px;
`;

const StyledTable = styled.div`
	align-items: end;
	display: flex;
	margin: 8px 0;
`;

const StyledMarginedRow = styled(StyledRow)`
	margin: 0 32px 32px;
`;

const StyledScoreLegend = styled.div<{ score: number }>`
	color: ${(props) => getQualityGradientColor(props.score)};
`;

const StyledScore = styled(StyledScoreLegend)`
	${h2Style}
	margin: 0 64px;
`;

const StyledSortLabel = styled.div`
	font-weight: 700;
	margin-right: 8px;
`;

const StyledTierLabel = styled(StyledScoreLegend)`
	font-weight: 900;
`;
