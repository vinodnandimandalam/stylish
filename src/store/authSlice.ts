import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {strings} from '../constants/strings';
import {ApiError} from '../utils/ApiClient';
import {
  clearLegacyAccessToken,
  clearRefreshToken,
  getRefreshToken,
  storeRefreshToken,
} from '../utils/SecureTokenStorage';
import {clearProductListCache} from '../modules/dashboard/productCache';
import {logoutUser} from '../modules/dashboard/logoutService';
import {
  loginUser,
  refreshAccessToken,
  type LoginRequest,
} from '../modules/login/loginService';
import type {RootState} from './store';

type RequestStatus = 'idle' | 'loading';

type AuthState = {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  isRestoringSession: boolean;
  accessToken: string | null;
  sessionRestoreError: string | null;
  loginStatus: RequestStatus;
  loginError: string | null;
  logoutStatus: RequestStatus;
  logoutError: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthInitialized: false,
  isRestoringSession: false,
  accessToken: null,
  sessionRestoreError: null,
  loginStatus: 'idle',
  loginError: null,
  logoutStatus: 'idle',
  logoutError: null,
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;

export const restoreSession = createAsyncThunk<
  string | null,
  void,
  {state: RootState; rejectValue: string}
>(
  'auth/restoreSession',
  async (_, {rejectWithValue}) => {
    try {
      await clearLegacyAccessToken();
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        return null;
      }

      let response;
      try {
        response = await refreshAccessToken(refreshToken);
      } catch (error) {
        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          await clearRefreshToken();
          return null;
        }
        throw error;
      }

      const accessToken = response.data?.accessToken;
      if (!accessToken) {
        throw new Error(strings.loginTokenMissing);
      }

      const rotatedRefreshToken = response.data?.refreshToken;
      if (!rotatedRefreshToken) {
        throw new Error(strings.loginRefreshTokenMissing);
      }

      await storeRefreshToken(rotatedRefreshToken);
      return accessToken;
    } catch (error) {
      return rejectWithValue(errorMessage(error, strings.loginNetworkError));
    }
  },
  {
    condition: (_, {getState}) => {
      const auth = getState().auth;
      return !auth.isAuthInitialized && !auth.isRestoringSession;
    },
  },
);

export const login = createAsyncThunk<
  string,
  LoginRequest,
  {rejectValue: string}
>('auth/login', async (credentials, {rejectWithValue}) => {
  try {
    const response = await loginUser(credentials);
    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;

    if (!accessToken) {
      throw new Error(strings.loginTokenMissing);
    }

    if (!refreshToken) {
      throw new Error(strings.loginRefreshTokenMissing);
    }

    await storeRefreshToken(refreshToken);
    await clearLegacyAccessToken();
    return accessToken;
  } catch (error) {
    return rejectWithValue(errorMessage(error, strings.loginFailed));
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  {rejectValue: string}
>(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      await logoutUser();
      await clearRefreshToken();
      await clearLegacyAccessToken();
      clearProductListCache();
    } catch (error) {
      return rejectWithValue(errorMessage(error, strings.logoutFailed));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearLoginError: state => {
      state.loginError = null;
    },
    clearSessionRestoreError: state => {
      state.sessionRestoreError = null;
    },
    clearLogoutError: state => {
      state.logoutError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.pending, state => {
        state.isRestoringSession = true;
        state.sessionRestoreError = null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthInitialized = true;
        state.isRestoringSession = false;
        state.accessToken = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.isAuthInitialized = true;
        state.isRestoringSession = false;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.sessionRestoreError =
          action.payload ?? strings.loginNetworkError;
      })
      .addCase(login.pending, state => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = 'idle';
        state.isAuthInitialized = true;
        state.accessToken = action.payload;
        state.sessionRestoreError = null;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = 'idle';
        state.loginError = action.payload ?? strings.loginNetworkError;
      })
      .addCase(logout.pending, state => {
        state.logoutStatus = 'loading';
        state.logoutError = null;
      })
      .addCase(logout.fulfilled, state => {
        state.logoutStatus = 'idle';
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'idle';
        state.logoutError = action.payload ?? strings.logoutFailed;
      });
  },
});

export const {
  clearLoginError,
  clearLogoutError,
  clearSessionRestoreError,
} = authSlice.actions;
export default authSlice.reducer;