import { rootApi } from "../rootApi";
import { PaginationParams } from "../types";
import { DeleteParams, DocumentParams, DocumentsResponse } from "./types";

const documentService = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      DocumentsResponse,
      PaginationParams & DocumentParams
    >({
      query: ({ page, document_id, size, status, uploaded_at, workgroup }) => {
        let queryParams: PaginationParams & DocumentParams = {};

        if (workgroup) queryParams.workgroup = workgroup;
        if (status) queryParams.status = status;
        if (uploaded_at) queryParams.uploaded_at = uploaded_at;
        if (size) queryParams.size = size;
        if (document_id) queryParams.document_id = document_id;
        if (page) queryParams.page = page;

        return {
          url: `/documents`,
          params: queryParams,
        };
      },
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
