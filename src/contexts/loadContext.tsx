import { createContext, FC, useReducer } from 'react';
import { ChildrenProps } from 'src/types';
import { LoaderScreen } from 'src/components';
import PropTypes from 'prop-types';

export interface LoadState {
  loading: boolean;
}

const initialState: LoadState = {
  loading: false
};

interface LoadContextValue extends LoadState {
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadContext = createContext<LoadContextValue>({
  ...initialState,
  startLoading: () => { },
  stopLoading: () => { }
});

type StartLoadingAction = {
  type: 'START_LOADING'
};

type StopLoadingAction = {
  type: 'STOP_LOADING'
};

type Action = StartLoadingAction | StopLoadingAction;

const handlers: Record<string, (state: LoadState, action: Action) => LoadState> = {
  START_LOADING: (): LoadState => ({
    loading: true
  }),
  STOP_LOADING: (): LoadState => ({
    loading: false
  })
};

const LoadReducer = (state: LoadState, action: Action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const LoadProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(LoadReducer, initialState);

  const startLoading = (): void => {
    dispatch({ type: 'START_LOADING' });
  };

  const stopLoading = (): void => {
    dispatch({ type: 'STOP_LOADING' });
  };

  return (
    <LoadContext.Provider value={{ ...state, startLoading, stopLoading }}>
      <LoaderScreen />
      {children}
    </LoadContext.Provider>
  );
};

LoadProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default LoadContext;
