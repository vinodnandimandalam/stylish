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