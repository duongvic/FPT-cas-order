export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: Response) {
  // if (response.status >= 200 && response.status < 300) {
  return response;
  // }
  // const error = new ResponseError(response);
  // error.response = response;
  // throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function getToken() {
  const user = localStorage.getItem('account');
  if (user) {
    const userInfo = JSON.parse(user);
    return userInfo.access_token;
  }
  return null;
}

export function setOptions(options: RequestInit) {
  const defaultOptions = { ...options };
  defaultOptions.headers = {
    ...defaultOptions.headers,
    'Content-Type': 'application/json',
  };
  defaultOptions.credentials = 'same-origin';

  const token = getToken();

  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return defaultOptions;
}

export async function request(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptions(options));
  return parseJSON(fetchResponse);
  // const response = checkStatus(fetchResponse);
}

export async function requestUnauth(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, options);
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}

export async function requestStatus(
  url: string,
  options: RequestInit,
): Promise<{} | { err: ResponseError }> {
  const fetchResponse = await fetch(url, setOptions(options));
  const status = fetchResponse.status;
  // console.log('status_check: ' + status)
  if (status === 200) {
    return true;
  }
  return parseJSON(fetchResponse);
}