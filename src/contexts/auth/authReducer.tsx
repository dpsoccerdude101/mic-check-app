import Permission from 'src/types/users/permission';
import type User from '../../types/users/user';

export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  token: string;
  user: User
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: User;
  };
};

type SetBandForAdminAction = {
  type: 'SETBANDFORADMIN',
  payload: {
    bandId: string
  }
};

type SetPermissionsAction = {
  type: 'SETPERMISSIONS',
  payload: {
    permissions: Permission[]
  }
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | SetBandForAdminAction
  | SetPermissionsAction;

const handlers: Record<string, (state: AuthState, action: Action) => AuthState> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },

  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },

  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),

  REGISTER: (state: AuthState, action: RegisterAction): AuthState => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },

  SETBANDFORADMIN: (state: AuthState, action: SetBandForAdminAction): AuthState => {
    const { bandId } = action.payload;
    const { user } = state;
    if (user.isAdmin) {
      const adminUser = user;
      user.bandId = bandId;
      return {
        ...state,
        user: adminUser
      };
    }
    console.log('User not authorized to set band id!');
    return state;
  },

  SETPERMISSIONS: (state: AuthState, action: SetPermissionsAction): AuthState => {
    const { permissions } = action.payload;
    const { user } = state;

    user.permissions = permissions;

    return {
      ...state,
      user
    };
  }
};

const authReducer = (state: AuthState, action: Action): AuthState => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export default authReducer;
