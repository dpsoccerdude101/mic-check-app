import { createContext, FC, useReducer } from 'react';
import { ChildrenProps, FanSpotlightDto } from 'src/types';
import SpotlightSortBy from 'src/types/fans/spotlights/spotlightSortBy';
import PropTypes from 'prop-types';

export interface SpotlightsState {
  spotlights: FanSpotlightDto[];
  sortBy: SpotlightSortBy;
}

const initialState: SpotlightsState = {
  spotlights: [],
  sortBy: SpotlightSortBy.DateUploaded,
};

interface SpotlightsContextValue extends SpotlightsState {
  addSpotlight: (video: FanSpotlightDto) => Promise<void>;
  deleteSpotlight: (spotlightId: string) => void;
  setSpotlights: (newSpotlights: FanSpotlightDto[]) => Promise<void>;
  setSortBy: (value: SpotlightSortBy) => void;
}

const SpotlightsContext = createContext<SpotlightsContextValue>({
  ...initialState,
  addSpotlight: () => Promise.resolve(),
  deleteSpotlight: () => { },
  setSpotlights: () => Promise.resolve(),
  setSortBy: () => { }
});

type AddSpotlightAction = {
  type: 'ADD_SPOTLIGHT',
  payload: {
    spotlight: FanSpotlightDto
  }
};

type DeleteSpotlightAction = {
  type: 'DELETE_SPOTLIGHT',
  payload: {
    spotlightId: string
  }
};

type SetSpotlightsAction = {
  type: 'SET_SPOTLIGHTS',
  payload: {
    newSpotlights: FanSpotlightDto[]
  }
};

type SetSortByAction = {
  type: 'SET_SORT_BY',
  payload: {
    value: SpotlightSortBy
  }
};

type Action = AddSpotlightAction | DeleteSpotlightAction | SetSpotlightsAction | SetSortByAction;

const handlers: Record<string, (state: SpotlightsState, action: Action) => SpotlightsState> = {
  ADD_SPOTLIGHT: (state: SpotlightsState, action: AddSpotlightAction): SpotlightsState => {
    const { spotlight } = action.payload;
    const { spotlights } = state;
    const newSpotlights = [...spotlights, ...[spotlight]];
    return {
      ...state,
      spotlights: newSpotlights
    };
  },

  DELETE_SPOTLIGHT: (state: SpotlightsState, action: DeleteSpotlightAction): SpotlightsState => {
    const { spotlightId } = action.payload;
    const { spotlights } = state;
    const newList = spotlights.filter((el) => el.id !== spotlightId);
    return {
      ...state,
      spotlights: newList
    };
  },

  SET_SPOTLIGHTS: (state: SpotlightsState, action: SetSpotlightsAction): SpotlightsState => {
    const { newSpotlights } = action.payload;
    return {
      ...state,
      spotlights: newSpotlights
    };
  },

  SET_SORT_BY: (state: SpotlightsState, action: SetSortByAction): SpotlightsState => {
    const { value } = action.payload;
    return {
      ...state,
      sortBy: value
    };
  }
};

const SpotlightsReducer = (state: SpotlightsState, action: Action): SpotlightsState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const SpotlightsProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(SpotlightsReducer, initialState);

  const addSpotlight = async (spotlight: FanSpotlightDto): Promise<void> => dispatch({ type: 'ADD_SPOTLIGHT', payload: { spotlight } });

  const deleteSpotlight = async (spotlightId: string) => dispatch({ type: 'DELETE_SPOTLIGHT', payload: { spotlightId } });

  const setSpotlights = async (newSpotlights: FanSpotlightDto[]): Promise<void> => {
    const { spotlights } = state;
    if (newSpotlights !== spotlights) { dispatch({ type: 'SET_SPOTLIGHTS', payload: { newSpotlights } }); }
  };

  const setSortBy = async (value: SpotlightSortBy) => dispatch({ type: 'SET_SORT_BY', payload: { value } });

  return (
    <SpotlightsContext.Provider value={{ ...state, addSpotlight, deleteSpotlight, setSpotlights, setSortBy }}>
      {children}
    </SpotlightsContext.Provider>
  );
};

SpotlightsProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export default SpotlightsContext;
