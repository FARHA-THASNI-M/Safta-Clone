import { rootApi } from "../rootApi";
import { APIResponse } from "../types";
import { LoginPayload, LoginResponse, ForgotPasswordPayload } from "./types";



const authService = rootApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginPayload>({
      query: (payload) => ({
        url: "/auth/login?lang=en",
        method: "POST",
        body: payload,
      }),
    }),

    forgotPassword: build.mutation<APIResponse<null>, ForgotPasswordPayload>({
      query: (email) => ({
        url: "/auth/password-reset/request?lang=en",
        method: "POST",
        body: { email },
      }),
    }),
  }),
  overrideExisting: false,
});
export const { useLoginMutation, useForgotPasswordMutation } = authService;
