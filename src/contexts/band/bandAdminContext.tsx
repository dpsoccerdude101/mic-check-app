import { createContext, FC, useReducer } from 'react';
import { Band, BaseResponse, BandRegisterModel, ChildrenProps, ListResponse, } from 'src/types';
import PropTypes from 'prop-types';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';

export interface BandListState {
  list: Band[];
  showAddBandDialog: boolean;
  totalCount: number;
}

const initialState: BandListState = {
  list: [],
  showAddBandDialog: false,
  totalCount: 0
};

interface BandListContextValue extends BandListState {
  addBand: (newBand: BandRegisterModel) => Promise<BaseResponse<Band>>;
  deleteBand: (toDelete: Band) => Promise<BaseResponse>;
  setShowAddBandDialog: (show: boolean) => void;
  setList: (newList: ListResponse<Band>) => Promise<void>;
}

const BandAdminContext = createContext<BandListContextValue>({
  ...initialState,
  addBand: () => Promise.resolve(null),
  deleteBand: () => Promise.resolve(null),
  setShowAddBandDialog: () => { },
  setList: () => Promise.resolve()
});

type AddBandAction = {
  type: 'ADD_BAND_ACTION',
  payload: {
    newBand: Band
  }
};

type DeleteBandAction = {
  type: 'DELETE_BAND_ACTION',
  payload: {
    toDeleteBand: Band
  }
};

type SetListAction = {
  type: 'SET_LIST',
  payload: {
    newList: ListResponse<Band>
  }
};

type ShowAddBandDialogAction = {
  type: 'SHOW_ADD_BAND_DIALOG',
  payload: {
    show: boolean
  }
};

type Action = AddBandAction | DeleteBandAction | SetListAction | ShowAddBandDialogAction;

const handlers: Record<string, (state: BandListState, action: Action) => BandListState> = {
  ADD_BAND_ACTION: (state: BandListState, action: AddBandAction): BandListState => {
    const { newBand } = action.payload;
    const { list, totalCount } = state;
    const newList = [...list, ...[newBand]];
    return {
      ...state,
      list: newList,
      totalCount: totalCount + 1
    };
  },

  DELETE_BAND_ACTION: (state: BandListState, action: DeleteBandAction): BandListState => {
    const { toDeleteBand } = action.payload;
    const { list, totalCount } = state;
    const newList = list.filter((el) => el.id !== toDeleteBand.id);
    return {
      ...state,
      list: newList,
      totalCount: totalCount - 1
    };
  },

  SET_LIST: (state: BandListState, action: SetListAction): BandListState => {
    const { newList } = action.payload;
    const { items, totalCount } = newList;
    return {
      ...state,
      list: items,
      totalCount
    };
  },

  SHOW_ADD_BAND_DIALOG: (state: BandListState, action: ShowAddBandDialogAction): BandListState => {
    const { show } = action.payload;
    return {
      ...state,
      showAddBandDialog: show
    };
  }
};

const BandListReducer = (state: BandListState, action: Action): BandListState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const BandAdminProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(BandListReducer, initialState);

  const addBand = async (newBand: BandRegisterModel): Promise<BaseResponse<Band>> => {
    const response: BaseResponse<Band> = await Api.post(ApiRoutes.Bands.CreateAsAdmin, newBand);
    const { data, success } = response;
    if (success) { dispatch({ type: 'ADD_BAND_ACTION', payload: { newBand: data } }); }
    return response;
  };

  const deleteBand = async (toDeleteBand: Band): Promise<BaseResponse> => {
    const response: BaseResponse = await Api.delete(ApiRoutes.Bands.Delete(toDeleteBand.id));
    const { success } = response;
    if (success) { dispatch({ type: 'DELETE_BAND_ACTION', payload: { toDeleteBand } }); }

    return response;
  };

  const setList = async (newList: ListResponse<Band>): Promise<void> => {
    dispatch({ type: 'SET_LIST', payload: { newList } });
  };

  const setShowAddBandDialog = (show: boolean) => dispatch({ type: 'SHOW_ADD_BAND_DIALOG', payload: { show } });
  return (
    <BandAdminContext.Provider value={{ ...state, addBand, deleteBand, setList, setShowAddBandDialog }}>
      {children}
    </BandAdminContext.Provider>
  );
};

BandAdminProvider.propTypes = {
  children: PropTypes.node.isRequired
};
export default BandAdminContext;
