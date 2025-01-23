import { rootApi } from "../rootApi";
import { WorkgroupsResponse } from "./types";

export const workgroupApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkgroups: builder.query<WorkgroupsResponse, void>({
      query: () => "workgroups/list?lang=en",
    }),
  }),
  overrideExisting: false,
});
export const { useGetWorkgroupsQuery } = workgroupApi;
