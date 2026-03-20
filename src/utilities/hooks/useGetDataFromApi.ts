import { protectedUrl, unprotectedUrl } from '@/url';
import axios from 'axios';
import { axiosFetch } from './useAxiosFetch';
import { useAtom } from 'jotai';

export const useGetDataFromApi = () => {
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('user_token');
    window.location.href = '/shop';
  };

  const fetchDataFromApi = async (
    token: any,
    url: any,
    successHandler: (data: any) => void,
    failureHandler: any,
    additionalHeaders: any
  ) => {
    let additionalHeadersToApi;

    if (token) {
      additionalHeadersToApi = {
        Authorization: `Bearer ${token}`,
        ...additionalHeaders
      };
    }

    const resolvedUrl = url.startsWith('/') ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${url}` : url;

    const response = await axiosFetch(resolvedUrl, {}, 'GET', additionalHeadersToApi);

    // Check for 401 status (Unauthorized/Token Expired)
    if (response.status === 401) {
      console.log('Token expired, logging out...');
      handleLogout();
      return { status: 401, bool: false, data: null };
    }

    if (response && response.success !== false) {
      successHandler(response.data);
      return { status: response.status, bool: true, data: response };
    } else {
      failureHandler(response);
      return { status: response.status, bool: false, data: response ? response : null };
    }
  };

  const getDataFromApi = async (
    url: string,
    successHandler: (data: any) => void,
    failureHandler: (error: any) => void,
    additionalHeaders: any
  ) => {
    const tokenString = localStorage.getItem('user_token');

    const isDataFetched = await fetchDataFromApi(tokenString, url, successHandler, failureHandler, additionalHeaders);

    if (isDataFetched.bool) {
      return;
    } else {
      failureHandler(isDataFetched.data);
    }
  };

  return getDataFromApi;
};
