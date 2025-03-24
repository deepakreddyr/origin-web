import { protectedUrl, unprotectedUrl } from '@/url';
import axios from 'axios';
import { axiosFetch } from './useAxiosFetch';
import { useAtom } from 'jotai';

export const useSendDataToApi = () => {
  const fetchDataFromApi = async (
    token: any,
    url: any,
    successHandler: (data: any) => void,
    additionalHeaders: any,
    data: any,
    method: string
  ) => {
    let additionalHeadersToApi;

    if (token) {
      // let storeId = localStorage.getItem()
      additionalHeadersToApi = {
        Authorization: `Bearer ${token}`,
        ...additionalHeaders
        // 'store-id': address?.defaultAddress?.address_id,
      };
    }

    const response = await axiosFetch(url, data, method, additionalHeadersToApi);
    if (response.success || response) {
      successHandler(response.data);
      return { status: response.status, bool: true, data: response };
    } else {
      return { status: response.status, bool: false, data: response };
    }
    // try {
    //     const headers = token
    //         ? { Authorization: `Bearer ${token.accessToken}` }
    //         : {}
    //     const response = await axios.get(url, { headers })
    //     if (response && response.status === 200) {
    //         successHandler(response.data)
    //         return {
    //             status: response.status,
    //             bool: true,
    //             data: response.data,
    //         }
    //     } else {
    //         return {
    //             status: response.status,
    //             bool: false,
    //             data: response.data,
    //         }
    //     }
    // } catch (error: any) {
    //     console.error('API Fetch Error:', error)
    //     return {
    //         status: error.response?.status || 500,
    //         bool: false,
    //         data: error.response?.data || error.message,
    //     }
    // }
  };

  const sendDataToApi = async (
    url: string,
    data: any,
    method: string,
    successHandler: (data: any) => void,
    failureHandler: (error: any) => void,
    additionalHeaders: any
  ) => {
    const tokenString = localStorage.getItem('user_token');
    let token = null;

    // if (!tokenString) {
    //     token = ''
    // } else {
    //     try {
    //         token = JSON.parse(tokenString)
    //     } catch (error) {
    //         console.error('Failed to parse token:', error)
    //         failureHandler('Invalid token format. Please log in.')
    //         return
    //     }
    //     // apiUrl = protectedUrl[url]
    // }
    const isDataFetched = await fetchDataFromApi(tokenString, url, successHandler, additionalHeaders, data, method);

    if (isDataFetched.bool) {
      return;
    } else {
      failureHandler(isDataFetched.data);
    }
  };

  return sendDataToApi;
};

// export const useGetDataFromApi = () => {
//     // const logoutUser = useLogoutUser();

//     const fetchDataFromApi = async (token:any, url:string, successHandler:any) => {
//         // let header;
//         // if (unProtectedApis[url]) {
//         //     if (token) header = { Authorization: Bearer ${token.accessToken} };
//         //     else header = {};
//         // } else {
//         //     header = { Authorization: Bearer ${token.accessToken} };
//         // }
//         // const response = await axiosFetch(url, undefined, "GET", header);

//         // if (response.success) {
//         //     successHandler(response.data);
//         //     return { status: response.status, bool: true, data: response };
//         // } else {
//         //     return { status: response.status, bool: false, data: response };
//         // }
//     };
//     const getDataFromApi = async (url:string, pathname:string, successHandler:any, failureHandler:any) => {
//         const token = JSON.parse(localStorage.getItem("user_token"))
//         // if (!token && !unProtectedApis[url]) {
//         //     logoutUser("Please login", pathname, url);
//         //     return;
//         // }
//         // const isDataFetched = await fetchDataFromApi(token, url, successHandler);
//         // if (isDataFetched.bool) return;
//         // else {
//         //     if (isDataFetched.status === 401) {
//         //         const { isNewTokenFetched, newToken } = await getAccessTokenFromRefreshToken(token);
//         //         if (isNewTokenFetched) {
//         //             localStorage.setItem("token", JSON.stringify(newToken));
//         //             setTokenInCookie(newToken);
//         //             const isDataFetched = await fetchDataFromApi(newToken, url, successHandler);
//         //             if (isDataFetched.bool) return;
//         //             else {
//         //                 logoutUser("Please login again", pathname, url);
//         //             }
//         //         } else {
//         //             logoutUser("Please login again", pathname, url);
//         //         }
//         //     } else {
//         //         failureHandler(isDataFetched.data);
//         //     }
//         }
//     };
//     return getDataFromApi;
// };
