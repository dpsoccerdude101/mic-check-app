import { createContext, FC, useReducer } from 'react';
import { ChildrenProps, FileModel } from 'src/types';
import PropTypes from 'prop-types';

interface BandGeneralState {
  name: string;
  description: string;
  hometown: string;
  selectedGenreTags: string[];
  profilePicture: FileModel;
}

const initialState: BandGeneralState = {
  name: null,
  description: null,
  selectedGenreTags: null,
  hometown: null,
  profilePicture: null
};

interface GeneralContextValue extends BandGeneralState {
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setSelectedGenreTags: (value: string[]) => void;
  setHometown: (text: string) => void;
  setProfilePicture: (value: FileModel) => void;
}

const BandGeneralContext = createContext<GeneralContextValue>({
  ...initialState,
  setName: () => { },
  setDescription: () => { },
  setSelectedGenreTags: () => { },
  setHometown: () => { },
  setProfilePicture: () => { }
});

type SetNameAction = {
  type: 'SETNAME',
  payload: {
    value: string
  }
};

type SetDescriptionAction = {
  type: 'SETDESCRIPTION',
  payload: {
    value: string
  }
};

type SetSelectedGenreTagsAction = {
  type: 'SETSELECTEDGENRETAGS',
  payload: {
    value: string[]
  }
};

type SetHometownAction = {
  type: 'SETHOMETOWN',
  payload: {
    value: string
  }
};

type SetProfilePictureAction = {
  type: 'SETPROFILEPICTURE',
  payload: {
    value: FileModel
  };
};

type Action =
  SetNameAction |
  SetDescriptionAction |
  SetSelectedGenreTagsAction |
  SetHometownAction |
  SetProfilePictureAction;

const handlers: Record<string, (state: BandGeneralState, action: Action) => BandGeneralState> = {
  SETNAME: (state: BandGeneralState, action: SetNameAction): BandGeneralState => {
    const { value } = action.payload;
    return {
      ...state,
      name: value
    };
  },

  SETDESCRIPTION: (state: BandGeneralState, action: SetDescriptionAction): BandGeneralState => {
    const { value } = action.payload;
    return {
      ...state,
      description: value
    };
  },

  SETHOMETOWN: (state: BandGeneralState, action: SetHometownAction): BandGeneralState => {
    const { value } = action.payload;
    return {
      ...state,
      hometown: value
    };
  },

  SETSELECTEDGENRETAGS: (state: BandGeneralState, action: SetSelectedGenreTagsAction): BandGeneralState => {
    const { value } = action.payload;
    return {
      ...state,
      selectedGenreTags: value
    };
  },

  SETPROFILEPICTURE: (state: BandGeneralState, action: SetProfilePictureAction): BandGeneralState => {
    const { value } = action.payload;
    return {
      ...state,
      profilePicture: value
    };
  }
};

const BandGeneralReducer = (state: BandGeneralState, action: Action): BandGeneralState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const BandGeneralProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(BandGeneralReducer, initialState);

  const setName = (value: string) => dispatch({ type: 'SETNAME', payload: { value } });

  const setDescription = (value: string) => dispatch({ type: 'SETDESCRIPTION', payload: { value } });

  const setSelectedGenreTags = (value: string[]) => dispatch({ type: 'SETSELECTEDGENRETAGS', payload: { value } });

  const setHometown = (value: string) => {
    dispatch({ type: 'SETHOMETOWN', payload: { value } });
  };

  const setProfilePicture = (value: FileModel) => dispatch({ type: 'SETPROFILEPICTURE', payload: { value } });

  return (
    <BandGeneralContext.Provider value={{ ...state, setName, setDescription, setSelectedGenreTags, setHometown, setProfilePicture }}>
      {children}
    </BandGeneralContext.Provider>
  );
};

BandGeneralProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BandGeneralContext;
