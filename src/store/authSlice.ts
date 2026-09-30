import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {strings} from '../constants/strings';
import {getBoolean, setBoolean, STORAGE_KEYS} from '../utils/MMKVStorage';
import {ApiError} from '../utils/ApiClient';
import {
  clearAccessToken,
  getAccessToken,
  storeAccessToken,
} from '../utils/SecureTokenStorage';
import {logoutUser} from '../modules/dashboard/logoutService';
import {loginUser, type LoginRequest} from '../modules/login/loginService';

type RequestStatus = 'idle' | 'loading';

type AuthState = {
  isAuthenticated: boolean;
  loginStatus: RequestStatus;
  loginError: string | null;
  logoutStatus: RequestStatus;
  logoutError: string | null;
};

const initialState: AuthState = {
  isAuthenticated: getBoolean(STORAGE_KEYS.IS_LOGGED_IN) ?? false,
  loginStatus: 'idle',
  loginError: null,
  logoutStatus: 'idle',
  logoutError: null,
};

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;

export const login = createAsyncThunk<
  void,
  LoginRequest,
  {rejectValue: string}
>('auth/login', async (credentials, {rejectWithValue}) => {
  try {
    const response = await loginUser(credentials);
    const accessToken = response.data?.accessToken;

    if (!accessToken) {
      throw new Error(strings.loginTokenMissing);
    }

    await storeAccessToken(accessToken);
    setBoolean(STORAGE_KEYS.IS_LOGGED_IN, true);
  } catch (error) {
    return rejectWithValue(errorMessage(error, strings.loginFailed));
  }
});

export const logout = createAsyncThunk<void, void, {rejectValue: string}>(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      const accessToken = await getAccessToken();

      if (accessToken) {
        try {
          await logoutUser(accessToken);
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401) {
            throw error;
          }
        }
      }

      await clearAccessToken();
      setBoolean(STORAGE_KEYS.IS_LOGGED_IN, false);
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
    clearLogoutError: state => {
      state.logoutError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loginStatus = 'loading';
        state.loginError = null;
      })
      .addCase(login.fulfilled, state => {
        state.loginStatus = 'idle';
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
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logoutStatus = 'idle';
        state.logoutError = action.payload ?? strings.logoutFailed;
      });
  },
});

export const {clearLoginError, clearLogoutError} = authSlice.actions;
export default authSlice.reducer;