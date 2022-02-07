import { createContext, FC, ReactNode, useReducer } from 'react';
import { Band, BaseResponse } from 'src/types';
import { Api } from 'src/utils';
import PropTypes from 'prop-types';
import { ApiRoutes } from 'src/constants';

export interface BandState {
  band: Band;
  isLoading: boolean;
  showPreview: boolean;
}

const initialState: BandState = {
  band: null,
  isLoading: false,
  showPreview: false
};

interface BandContextValue extends BandState {
  loadBand: (id: string) => Promise<void>;
  setBand: (band: Band) => void;
  saveBand: (band: Band) => Promise<BaseResponse<Band>>;
  setLoading: (isLoading: boolean) => void;
  setProfilePreview: (preview: boolean) => void;
}

const BandContext = createContext<BandContextValue>({
  ...initialState,
  loadBand: () => Promise.resolve(),
  setBand: () => { },
  saveBand: () => Promise.resolve(null),
  setLoading: () => { },
  setProfilePreview: () => { }
});

type SetBandAction = {
  type: 'SET_BAND',
  payload: {
    band: Band
  }
};

type SetLoadingAction = {
  type: 'SET_LOADING',
  payload: {
    isLoading: boolean
  }
};

type SetProfilePreviewAction = {
  type: 'SET_PROFILE_PREVIEW',
  payload: {
    preview: boolean
  }
};

type Action = SetBandAction | SetLoadingAction | SetProfilePreviewAction;

const handlers: Record<string, (state: BandState, action: Action) => BandState> = {
  SET_BAND: (state: BandState, action: SetBandAction): BandState => {
    const { band } = action.payload;
    return {
      ...state,
      band
    };
  },

  SET_LOADING: (state: BandState, action: SetLoadingAction): BandState => {
    const { isLoading } = action.payload;
    return {
      ...state,
      isLoading
    };
  },

  SET_PROFILE_PREVIEW: (state: BandState, action: SetProfilePreviewAction): BandState => {
    const { preview } = action.payload;
    return {
      ...state,
      showPreview: preview
    };
  }
};

const BandReducer = (state: BandState, action: Action): BandState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

type BandProviderProps = {
  loadedBand?: Band,
  children: ReactNode
};

export const BandProvider: FC<BandProviderProps> = (props) => {
  const { loadedBand, children } = props;
  const [state, dispatch] = useReducer(BandReducer, loadedBand ? { ...initialState, band: loadedBand } : initialState);

  const loadBand = async (id: string): Promise<void> => {
    const response: BaseResponse<Band> = await Api.get(ApiRoutes.Bands.Get(id));
    const { data, success } = response;
    if (success) { dispatch({ type: 'SET_BAND', payload: { band: data } }); }
  };

  const saveBand = async (band: Band): Promise<BaseResponse<Band>> => {
    const response: BaseResponse<Band> = await Api.put(ApiRoutes.Bands.Profile, band);
    const { data, success } = response;
    if (success) {
      dispatch({ type: 'SET_BAND', payload: { band: data } });
    }
    return response;
  };

  const setBand = (band: Band) => {
    dispatch({ type: 'SET_BAND', payload: { band } });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { isLoading } });
  };

  const setProfilePreview = (preview: boolean) => {
    dispatch({ type: 'SET_PROFILE_PREVIEW', payload: { preview } });
  };

  return (
    <BandContext.Provider value={{ ...state, loadBand, saveBand, setBand, setLoading, setProfilePreview }}>
      {children}
    </BandContext.Provider>
  );
};

BandProvider.propTypes = {
  children: PropTypes.node.isRequired,
  loadedBand: PropTypes.any
};
export default BandContext;
