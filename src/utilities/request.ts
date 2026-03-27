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

    // headers['store-id'] = '1'

    // const storeId = localStorage.getItem('store-id');
    // if (storeId && storeId !== 'null') {
    //   headers['store-id'] = storeId;
    // }
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
