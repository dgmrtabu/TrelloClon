const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

interface ApiErrorShape {
  error?: {
    message?: string;
    details?: unknown;
  };
  message?: string;
}

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  let payload: ApiErrorShape | T | null = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    payload = await response.json();
  }

  if (!response.ok) {
    const message = (payload as ApiErrorShape)?.error?.message ?? (payload as ApiErrorShape)?.message ?? `Error ${response.status}`;
    throw new Error(message);
  }

  return (payload as T) ?? ({} as T);
};
