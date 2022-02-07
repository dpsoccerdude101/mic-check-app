import { createContext, FC, useReducer } from 'react';
import { BandMedia, ChildrenProps } from 'src/types';
import PropTypes from 'prop-types';

export interface BandVideosState {
  videos: BandMedia[];
}

const initialState: BandVideosState = {
  videos: []
};

interface BandVideosContextValue extends BandVideosState {
  addVideo: (video: BandMedia) => Promise<void>;
  setVideos: (newVideos: BandMedia[]) => Promise<void>;
}

const BandVideosContext = createContext<BandVideosContextValue>({
  ...initialState,
  addVideo: () => Promise.resolve(),
  setVideos: () => Promise.resolve()
});

type AddVideoAction = {
  type: 'ADD_VIDEO',
  payload: {
    video: BandMedia
  }
};

type SetVideosAction = {
  type: 'SET_VIDEOS',
  payload: {
    newVideos: BandMedia[]
  }
};

type Action = AddVideoAction | SetVideosAction;

const handlers: Record<string, (state: BandVideosState, action: Action) => BandVideosState> = {
  ADD_VIDEO: (state: BandVideosState, action: AddVideoAction): BandVideosState => {
    const { video } = action.payload;
    const { videos } = state;
    const newVideos = [...videos, ...[video]];
    return {
      ...state,
      videos: newVideos
    };
  },

  SET_VIDEOS: (state: BandVideosState, action: SetVideosAction): BandVideosState => {
    const { newVideos } = action.payload;
    return {
      ...state,
      videos: newVideos
    };
  }
};

const BandVideosReducer = (state: BandVideosState, action: Action): BandVideosState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const BandVideosProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(BandVideosReducer, initialState);

  const addVideo = async (video: BandMedia): Promise<void> => dispatch({ type: 'ADD_VIDEO', payload: { video } });

  const setVideos = async (newVideos: BandMedia[]): Promise<void> => {
    const { videos } = state;
    if (newVideos !== videos) { dispatch({ type: 'SET_VIDEOS', payload: { newVideos } }); }
  };

  return (
    <BandVideosContext.Provider value={{ ...state, addVideo, setVideos }}>
      {children}
    </BandVideosContext.Provider>
  );
};

BandVideosProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export default BandVideosContext;
