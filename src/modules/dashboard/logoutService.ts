import {API_ENDPOINTS} from '../../constants/api';
import {strings} from '../../constants/strings';
import {apiClient} from '../../utils/ApiClient';

type LogoutResponse = {
  success?: boolean;
  message?: string;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);

  if (response?.success === false) {
    throw new Error(response.message || strings.logoutFailed);
  }

  return response;
};