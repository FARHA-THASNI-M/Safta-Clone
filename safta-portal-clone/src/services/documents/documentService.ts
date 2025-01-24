import { rootApi } from "../rootApi";
import { PaginationParams } from "../types";
import { DeleteParams, DocumentParams, DocumentsResponse } from "./types";

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
    deleteDocument: build.mutation<void, DeleteParams>({
      query: ({ id, workgroup_id }) => ({
        url: `/workgroups/${workgroup_id}/documents/${id}?lang=en`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetDocumentsQuery, useDeleteDocumentMutation } =
  documentService;
