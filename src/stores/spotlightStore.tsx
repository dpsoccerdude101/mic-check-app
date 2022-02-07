import { FanSpotlightDto } from 'src/types';
import create from 'zustand';
import { spotlightStoreLabel } from 'src/constants/appConstants';
import SpotlightsService from 'src/services/spotlightsService';
import { Formatter } from 'src/utils';
import FanSpotlightCommentDto from 'src/types/fans/spotlights/fanSpotlightCommentDto';
import persist from './persist';

interface SpotlightState {
  selectedSpotlight: FanSpotlightDto;
  spotlights: FanSpotlightDto[];
  setSpotlights: (newSpotlights: FanSpotlightDto[]) => void;
  setSelectedSpotlight: (newSpotlight: FanSpotlightDto) => void;

  // static data (selected spotlight)
  id: string;
  creationTime: Date;
  creatorProfilePicturePath: string;
  creatorUsername: string;
  showDateStr: string;
  title: string;
  videoSrc: string;

  // dynamic data
  comments: FanSpotlightCommentDto[];
  addComment: (value: FanSpotlightCommentDto) => void;
  setComments: (value: FanSpotlightCommentDto[]) => void;

  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;

  likesCount: number;
  incrementLikesCount: () => void;
  decrementLikesCount: () => void;

  viewsCount: number;
  incrementViewsCount: () => void;

  showSignInBanner: boolean;
  setShowSignInBanner: (value: boolean) => void;
}

const useSpotlightStore = create<SpotlightState>(
  persist(
    (set) => ({
      spotlights: [],
      setSpotlights: (newSpotlights: FanSpotlightDto[]) => {
        set((state: SpotlightState) => ({ ...state, spotlights: newSpotlights }));
      },

      setSelectedSpotlight: async (newSpotlight: FanSpotlightDto) => {
        const
          {
            id, creatorProfilePicturePath, creatorUsername,
            creationTime, likesCount, viewsCount,
            show, title, filePath
          } = newSpotlight;
        let showDateStr = '';
        if (show) {
          showDateStr = Formatter.formatDateAndTime(show.date);
        }

        const isFavorite = await SpotlightsService.checkIfUserLiked(id);
        set((state: SpotlightState) => (
          {
            ...state,
            id,
            creatorProfilePicturePath,
            creatorUsername,
            creationTime,
            likesCount,
            isFavorite,
            selectedSpotlight: newSpotlight,
            showDateStr,
            title,
            videoSrc: filePath,
            viewsCount,
          }
        ));
      },
      id: null,
      creationTime: null,

      comments: [],
      addComment: (value: FanSpotlightCommentDto) => {
        set((state) => ({ ...state, comments: [value, ...state.comments] }));
      },
      setComments: (value: FanSpotlightCommentDto[]) => {
        set((state) => ({ ...state, comments: value }));
      },

      isFavorite: false,
      setIsFavorite: (newValue: boolean) => {
        set((state: SpotlightState) => ({ ...state, isFavorite: newValue }));
      },

      likesCount: 0,
      decrementLikesCount: () => {
        set((state: SpotlightState) => ({
          ...state,
          likesCount: state.likesCount === 0 ? 0 : state.likesCount - 1
        }));
      },
      incrementLikesCount: () => {
        set((state: SpotlightState) => ({
          ...state,
          likesCount: state.likesCount + 1
        }));
      },

      viewsCount: 0,
      incrementViewsCount: () => {
        set((state: SpotlightState) => ({
          ...state,
          viewsCount: state.viewsCount + 1
        }));
      },

      showSignInBanner: false,
      setShowSignInBanner: (value: boolean) => {
        set((state: SpotlightState) => ({ ...state, showSignInBanner: value }));
      }
    }),
    spotlightStoreLabel
  )
);

export default useSpotlightStore;
