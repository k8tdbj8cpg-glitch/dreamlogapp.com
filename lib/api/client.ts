/**
 * Lightweight fetch-based API client for RESTful interactions.
 * Wraps the native Fetch API with typed helpers and uniform error handling.
 */

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body" | "method"> & {
  /** Query parameters to append to the URL */
  params?: Record<string, string | number | boolean>;
};

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  if (!params || Object.keys(params).length === 0) {
    return path;
  }
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );
  return `${path}?${search.toString()}`;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  const url = buildUrl(path, params);

  const headers: HeadersInit = {
    ...(body !== undefined && { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const json = await response.json();
      if (typeof json?.error === "string") {
        message = json.error;
      }
    } catch {
      // ignore JSON parse errors; keep statusText as message
    }
    throw new ApiError(response.status, message);
  }

  // Return undefined for 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, body, options);
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
};
