import {API_BASE_URL} from '../constants/api';

type ApiRequestOptions = {
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly responseBody?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getErrorMessage = (body: unknown, status: number): string => {
  if (body && typeof body === 'object') {
    const response = body as {message?: unknown; error?: unknown};
    if (typeof response.message === 'string') {
      return response.message;
    }
    if (typeof response.error === 'string') {
      return response.error;
    }
  }

  return `Request failed with status ${status}.`;
};

const request = async <Response>(
  method: string,
  endpoint: string,
  body?: unknown,
  options: ApiRequestOptions = {},
): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : {'Content-Type': 'application/json'}),
      ...options.headers,
    },
    ...(body === undefined ? {} : {body: JSON.stringify(body)}),
  });

  const responseText = await response.text();
  let responseBody: unknown;

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(responseBody, response.status),
      response.status,
      responseBody,
    );
  }

  return responseBody as Response;
};

export const apiClient = {
  get: <Response>(endpoint: string, options?: ApiRequestOptions) =>
    request<Response>('GET', endpoint, undefined, options),
  post: <Response, Body = undefined>(
    endpoint: string,
    body?: Body,
    options?: ApiRequestOptions,
  ) => request<Response>('POST', endpoint, body, options),
  put: <Response, Body>(
    endpoint: string,
    body: Body,
    options?: ApiRequestOptions,
  ) => request<Response>('PUT', endpoint, body, options),
  patch: <Response, Body>(
    endpoint: string,
    body: Body,
    options?: ApiRequestOptions,
  ) => request<Response>('PATCH', endpoint, body, options),
  delete: <Response>(endpoint: string, options?: ApiRequestOptions) =>
    request<Response>('DELETE', endpoint, undefined, options),
};