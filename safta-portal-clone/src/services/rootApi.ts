import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { handleLogout } from "../utils/authUtils";
// import {
//   BaseQueryFn,
//   createApi,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

// export const rootApi = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://dev-portal.safta.sa/api/v1",
// prepareHeaders: (headers) => {
//   const token = localStorage.getItem("userToken");

//   if (token) {
//     headers.set("Authorization", `Bearer ${token}`);
//   }
//   return headers;
// },
//   }),

//   endpoints: () => ({}),
// });
// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions)
//   if (result.error && result.error.status === 401) {
//     // try to get a new token
//     const refreshResult = await baseQuery('/refreshToken', api, extraOptions)
//     if (refreshResult.data) {
//       // store the new token
//       api.dispatch(tokenReceived(refreshResult.data))
//       // retry the initial query
//       result = await baseQuery(args, api, extraOptions)
//     } else {
//       api.dispatch(loggedOut())
//     }
//   }
//   return result
// }

const baseQuery = fetchBaseQuery({
  baseUrl: "https://dev-portal.safta.sa/api/v1",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    handleLogout();
    // localStorage.removeItem("isAuthenticated");
    // localStorage.removeItem("userLoginName");
    // localStorage.removeItem("userEmail");
    // localStorage.removeItem("userToken");
  }
  return result;
};

const rootApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Documents"],
});
export default rootApi;
