import { createContext, FC, useReducer } from 'react';
import { ChildrenProps } from 'src/types';

import BandYTVideo from 'src/types/band/bandYTVideo';
import PropTypes from 'prop-types';

export interface BandYTVideosState {
    ytVideos: BandYTVideo[];
}

const initialState: BandYTVideosState = {
    ytVideos: [],
};

interface BandYTVideosContextValue extends BandYTVideosState {
    addYTVideo: (ytVideo: BandYTVideo) => Promise<void>;
    setYTVideos: (newYTVideos: BandYTVideo[]) => Promise<void>;
}

const BandYTVideosContext = createContext<BandYTVideosContextValue>({
    ...initialState,
    addYTVideo: () => Promise.resolve(),
    setYTVideos: () => Promise.resolve(),
});

type AddYTVideoAction = {
    type: 'ADD_YTVIDEO';
    payload: {
        ytVideo: BandYTVideo;
    };
};

type SetYTVideosAction = {
    type: 'SET_YTVIDEOS';
    payload: {
        newYTVideos: BandYTVideo[];
    };
};

type Action = AddYTVideoAction | SetYTVideosAction;

const handlers: Record<
    string,
    (state: BandYTVideosState, action: Action) => BandYTVideosState
> = {
    ADD_YTVIDEO: (
        state: BandYTVideosState,
        action: AddYTVideoAction
    ): BandYTVideosState => {
        const { ytVideo } = action.payload;
        const { ytVideos } = state;
        const newVideos = [...ytVideos, ...[ytVideo]];
        return {
            ...state,
            ytVideos: newVideos,
        };
    },

    SET_YTVIDEOS: (
        state: BandYTVideosState,
        action: SetYTVideosAction
    ): BandYTVideosState => {
        const { newYTVideos } = action.payload;
        return {
            ...state,
            ytVideos: newYTVideos,
        };
    },
};

const BandYTVideosReducer = (
    state: BandYTVideosState,
    action: Action
): BandYTVideosState =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const BandYTVideosProvider: FC<ChildrenProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(BandYTVideosReducer, initialState);

    const addYTVideo = async (ytVideo: BandYTVideo): Promise<void> =>
        dispatch({ type: 'ADD_YTVIDEO', payload: { ytVideo } });

    const setYTVideos = async (newYTVideos: BandYTVideo[]): Promise<void> => {
        const { ytVideos } = state;
        if (newYTVideos !== ytVideos) {
            dispatch({ type: 'SET_YTVIDEOS', payload: { newYTVideos } });
        }
    };

    return (
        <BandYTVideosContext.Provider
            value={{ ...state, addYTVideo, setYTVideos }}
        >
            {children}
        </BandYTVideosContext.Provider>
    );
};

BandYTVideosProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export default BandYTVideosContext;
