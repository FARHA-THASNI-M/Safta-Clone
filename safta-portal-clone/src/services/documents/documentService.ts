import { rootApi } from "../rootApi";
import { PaginationParams } from "../types";
import { DeleteParams, DocumentParams, DocumentsResponse } from "./types";

const documentService = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      DocumentsResponse,
      PaginationParams & DocumentParams
    >({
      query: ({ page, size, workgroup, status, uploaded_at }) => {
        let queryParams = `?lang=en&page=${page || 1}&size=${size || 10}`;

        if (workgroup) queryParams += `&workgroup=${workgroup}`;
        if (status) queryParams += `&status=${status}`;
        if (uploaded_at) queryParams += `&uploaded_at=${uploaded_at}`;

        return {
          url: `/documents${queryParams}`,
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
