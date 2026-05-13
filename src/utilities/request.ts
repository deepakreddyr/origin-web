export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

/**
 * Gets the auth header from localStorage.
 *
 * @return {object} Returns an object with header if logged in.
 */
export function header() {
  const userToken = localStorage ? localStorage.getItem('user_token') : null;
  if (userToken) {
    return `Bearer ${userToken}`;
  }
  return '';
}

export async function request(
  url: string,
  // @ts-ignore
  // eslint-disable-next-line no-undef
  options?: RequestInit
): Promise<{} | { err: ResponseError }> {
  let requestUrl = url;
  if (url.startsWith('/')) {
    requestUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${url}`;
  }

  const headers: any = {
    ...options?.headers,
    'MM-Device-Type': 'web',
    'MM-Build-Version': '1.0.1'
  };

  if (typeof window !== 'undefined') {
    headers['Delivery-Type'] = localStorage.getItem('Delivery-Type') || 'instant';

    // Auto-inject store-id if not already provided by the caller
    if (!headers['store-id']) {
      let resolvedStoreId: string | null = null;

      // Try selected_address first (primary source)
      try {
        const selectedAddress = localStorage.getItem('selected_address');
        if (selectedAddress) {
          const parsed = JSON.parse(selectedAddress);
          if (parsed?.store_id) {
            resolvedStoreId = String(parsed.store_id);
          }
        }
      } catch {}

      // Fallback to standalone store-id (e.g. during registration)
      if (!resolvedStoreId) {
        const storeId = localStorage.getItem('store-id');
        if (storeId && storeId !== 'null') {
          try {
            resolvedStoreId = String(JSON.parse(storeId));
          } catch {
            resolvedStoreId = storeId;
          }
        }
      }

      if (resolvedStoreId) {
        headers['store-id'] = resolvedStoreId;
      }
    }
  }

  const fetchResponse = await fetch(requestUrl, {
    ...options,
    headers
  });

  // Check for 522 (Individual users are restricted)
  if (fetchResponse.status === 522) {
    const data = await fetchResponse
      .clone()
      .json()
      .catch(() => ({}));
    if (data.message === 'Individual users are restricted' && typeof window !== 'undefined') {
      console.log('Status 522 (Individual users are restricted) received, logging out...');
      localStorage.removeItem('user_token');
      window.location.reload();
    }
  }

  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}
