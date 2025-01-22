import { rootApi } from "../rootApi";
import { PaginationParams } from "../types";
import { DocumentParams, DocumentsResponse } from "./types";

const documentService = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      DocumentsResponse,
      PaginationParams & DocumentParams
    >({
      query: (params) => ({
        url: "/documents?lang=en",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetDocumentsQuery } = documentService;
