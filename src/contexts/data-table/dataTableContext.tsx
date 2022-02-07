import { createContext, FC, ReactNode, useReducer } from "react";

export interface DataTableState {
    reload: boolean;
}

const initialState: DataTableState = {
    reload: false
};

interface DataTableValue extends DataTableState {
    setReloadGrid: (reload: boolean) => void;
}

const DataTableContext = createContext<DataTableValue>({
    ...initialState,
    setReloadGrid: () => {}
});

type DataTableProviderProps = {
    children: ReactNode
};

export const DataTableProvider: FC<DataTableProviderProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(DataTableReducer, initialState);

    const setReloadGrid = (reload: boolean) => {
        dispatch({ type: 'SET_RELOAD', payload: { reload }});
    }

    return (
        <DataTableContext.Provider value={{ ...state, setReloadGrid}}>
            {children}
        </DataTableContext.Provider>
    );
};

type SetReloadAction = {
    type: 'SET_RELOAD',
    payload: {
        reload: boolean
    }
};

const handlers: Record<string, (state: DataTableState, action: SetReloadAction) => DataTableState> = {
    SET_RELOAD: (state: DataTableState, action: SetReloadAction): DataTableState => {
        const { reload } = action.payload;
        return {
          ...state,
          reload
        };
      },
}

const DataTableReducer = (state: DataTableState, action: SetReloadAction): DataTableState => (
    handlers[action.type] ? handlers[action.type](state, action) : state
);

export default DataTableContext;