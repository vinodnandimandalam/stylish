import {API_ENDPOINTS} from '../../constants/api';
import {strings} from '../../constants/strings';
import {apiClient} from '../../utils/ApiClient';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
  };
};

export type RefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
};

export const loginUser = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse, LoginRequest>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials,
  );

  if (response?.success === false) {
    throw new Error(response.message || strings.loginFailed);
  }

  return response;
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<
    RefreshTokenResponse,
    {refreshToken: string}
  >(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {refreshToken});

  if (response?.success === false) {
    throw new Error(response.message || strings.loginFailed);
  }

  return response;
};