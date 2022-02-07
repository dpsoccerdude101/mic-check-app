import { createContext, FC, useReducer } from 'react';
import { ChildrenProps } from 'src/types';
import PropTypes from 'prop-types';

export interface LoginState {
  loading: boolean;
}

const initialState: LoginState = {
  loading: false
};

interface LoginContextValue extends LoginState {
  startLoading: () => void;
  stopLoading: () => void;
}

const LoginContext = createContext<LoginContextValue>({
  ...initialState,
  startLoading: () => { },
  stopLoading: () => { }
});

type StartLoginingAction = {
  type: 'START_LOADING'
};

type StopLoginingAction = {
  type: 'STOP_LOADING'
};

type Action = StartLoginingAction | StopLoginingAction;

const handlers: Record<string, (state: LoginState, action: Action) => LoginState> = {
  START_LOADING: (): LoginState => ({
    loading: true
  }),
  STOP_LOADING: (): LoginState => ({
    loading: false
  })
};

const LoginReducer = (state: LoginState, action: Action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const LoginProvider: FC<ChildrenProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(LoginReducer, initialState);

  const startLoading = (): void => {
    dispatch({ type: 'START_LOADING' });
  };

  const stopLoading = (): void => {
    dispatch({ type: 'STOP_LOADING' });
  };

  return (
    <LoginContext.Provider value={{ ...state, startLoading, stopLoading }}>
      {children}
    </LoginContext.Provider>
  );
};

LoginProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default LoginContext;
