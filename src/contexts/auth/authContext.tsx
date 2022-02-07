import { createContext, FC, ReactNode, useReducer, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { ApiRoutes, TrackActions, UiRoutes } from 'src/constants';
import Cookies from 'js-cookie';
import TrackService from 'src/services/trackService';
import { createUser } from 'src/types/users/loggedUser';
import { BaseResponse, LoggedUser, LoginResponse, LoggedUserTypeEnum } from 'src/types';

import AppConstants from '../../constants/appConstants';
import authReducer, { AuthState } from './authReducer';
import type User from '../../types/users/user';
import api from '../../utils/api';
import Permission from 'src/types/users/permission';

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  token: '',
  user: null
};

interface AuthContextValue extends AuthState {
  goHome: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setBandIdForAdmin: (bandId: string) => void;
  setToken: (token: string) => Promise<void>;
  setUserPermissions: (permissions: Permission[]) => void;
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  goHome: () => Promise.resolve(),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setBandIdForAdmin: () => { },
  setToken: () => Promise.resolve(),
  setUserPermissions: () => { },
});

interface AuthProviderProps {
  children: ReactNode;
}

const getBandIdOnCookie = (): string => Cookies.get(AppConstants.bandIdLabel);
const setBandIdOnCookie = (bandId: string | null): void => {
  if (bandId) {
    Cookies.set(AppConstants.bandIdLabel, bandId, { expires: 365 });
  } else {
    Cookies.remove(AppConstants.bandIdLabel);
  }
};

const getFanIdOnCookie = (): string => Cookies.get(AppConstants.fanIdLabel);
const setFanIdOnCookie = (fanId: string | null): void => {
  if (fanId) {
    Cookies.set(AppConstants.fanIdLabel, fanId, { expires: 365 });
  } else {
    Cookies.remove(AppConstants.fanIdLabel);
  }
};

const clearCookies = () => {
  setFanIdOnCookie(null);
  setBandIdOnCookie(null);
};

const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    Cookies.set(AppConstants.tokenLabel, accessToken, { expires: 365 });
  } else {
    Cookies.remove(AppConstants.tokenLabel);
    setBandIdOnCookie(null);
  }
};

const loadBandMember = async (user: LoggedUser): Promise<LoggedUser> => {
  let bandId: string = getBandIdOnCookie();
  if (!bandId) {
    const response: BaseResponse = await api.get(ApiRoutes.Bands.GetBandIdFromMember(user.id));
    if (response.success) { bandId = response.data; }
    setBandIdOnCookie(bandId);
  }
  return createUser(user, bandId, LoggedUserTypeEnum.BandMember);
};

const loadAdminUser = async (user: LoggedUser): Promise<LoggedUser> => {
  const bandId: string = getBandIdOnCookie();
  return createUser(user, bandId, LoggedUserTypeEnum.Admin);
};

const loadFanUser = async (user: LoggedUser): Promise<LoggedUser> => {
  let fanId: string = getFanIdOnCookie();
  if (!fanId) {
    const response: BaseResponse<string> = await api.get(ApiRoutes.Fans.GetIdFromUserId(user.id));
    const { data, success } = response;
    if (success) {
      fanId = data;
      setFanIdOnCookie(data);
    }
  }
  return createUser(user, fanId, LoggedUserTypeEnum.Fan);
};

const loadUserPermissions = async (userId: string): Promise<Permission[]> => {
  let permissions = [];
  const response: BaseResponse = await api.get(ApiRoutes.Account.LoggedUser);
  const { data, success } = response;
  if (success) {
    permissions = data.roles.flatMap(p => p.permissions);
  }

  return permissions;
};

const parseUserFromToken = async (token: string): Promise<User> => {
  const decoded = jwtDecode<any>(token);
  const user: LoggedUser = { 
    id: '', 
    name: '', 
    email: '', 
    isAdmin: false,
    isBandMember: false,
    isFan: false,
    type: null, 
    permissions: []
  };

  // parsing identity claims
  Object.keys(decoded).forEach((key) => {
    const res = key.split('/');
    if (res.length > 1) {
      const id: string = res[res.length - 1];
      switch (id.toLowerCase()) {
        case 'emailaddress':
          user.email = decoded[key];
          break;

        case 'givenname':
          user.name = decoded[key];
          break;

        case 'nameidentifier':
          user.id = decoded[key];
          break;
        default:
          break;
      }
    } else {
      switch (key.toLowerCase()) {
        case 'isadmin':
          user.isAdmin = decoded[key] === 'True';
          user.type = LoggedUserTypeEnum.Admin;
          break;

        case 'isband_member':
          user.isBandMember = decoded[key] === 'True';
          user.type = LoggedUserTypeEnum.BandMember;
          break;

        case 'isfan':
          user.isFan = decoded[key] === 'True';
          user.type = LoggedUserTypeEnum.Fan;
          break;
        default:
          break;
      }
    }
  });

  user.permissions = await loadUserPermissions(user.id);
  
  if (user.isAdmin) {
    return loadAdminUser(user);
  }

  if (user.isBandMember) {
    return await loadBandMember(user);
  }
  setBandIdOnCookie(null);

  if (user.isFan) {
    return await loadFanUser(user);
  }

  return user;
};

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = Cookies.get(AppConstants.tokenLabel);
        if (!accessToken) {
          dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, user: null } });
        } else if (!state.user) {
          setSession(accessToken);
          const user = await parseUserFromToken(accessToken);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const identifyUserOnAnalytics = (user: User) => {
    TrackService.identify(user.id, user);
  };

  const goHome = async (fixedUser: User = null) => {
    const user = state.user != null ? state.user : fixedUser;
    let redirectUrl = '';
    // Check if needs to be redirect
    redirectUrl = Cookies.get(AppConstants.redirectUrlLabel);
    if (!redirectUrl) {
      if (user.isAdmin) {
        redirectUrl = UiRoutes.Bands.List;
      } else if (user.isBandMember) {
        redirectUrl = UiRoutes.MyBand.Home;
      } else if (user.isFan) {
        redirectUrl = UiRoutes.Fans.Discover;
      } else {
        redirectUrl = UiRoutes.Fans.Discover;
      }
    }
    identifyUserOnAnalytics(user);
    await router.push(redirectUrl);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const baseResponse: BaseResponse = await api.post(ApiRoutes.Account.Login, { email, password });
    const loginResponse = baseResponse as LoginResponse;
    const { message, success } = loginResponse;
    if (success) {
      clearCookies();
      const { token } = loginResponse;
      setSession(token);
      const user = await parseUserFromToken(token);
      TrackService.trackAction(TrackActions.USER_LOGGED_IN, {}, user);
      dispatch({ type: 'LOGIN', payload: { user } });
      await goHome(user);
    } else {
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const setToken = async (token: string) => {
    setSession(token);
    const user = await parseUserFromToken(token);
    dispatch({ type: 'LOGIN', payload: { user } });
    await goHome(user);
  };

  const logout = async () => {
    setSession(null);
    clearCookies();
    dispatch({ type: 'LOGOUT' });
    await router.push(UiRoutes.Auth.Login);
  };

  const setBandIdForAdmin = async (bandId: string) => {
    setBandIdOnCookie(bandId);
    dispatch({ type: 'SETBANDFORADMIN', payload: { bandId } });
  };

  const setUserPermissions = async (permissions: Permission[]) => {
    dispatch({ type: 'SETPERMISSIONS', payload: { permissions }})
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        goHome,
        login,
        logout,
        setToken,
        setBandIdForAdmin,
        setUserPermissions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
