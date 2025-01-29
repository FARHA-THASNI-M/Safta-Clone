import { rootApi } from "../rootApi";
import { PaginationParams } from "../types";
import {
  DeleteParams,
  DocumentParams,
  DocumentsResponse,
  DocumentResponse,
  DeliverablesResponse,
} from "./types";

const documentService = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      DocumentsResponse,
      PaginationParams & DocumentParams & { q?: string }
    >({
      query: ({
        page,
        document_id,
        size,
        status,
        uploaded_at,
        workgroup,
        q,
      }) => {
        let queryParams: PaginationParams & DocumentParams = {};

        if (workgroup) queryParams.workgroup = workgroup;
        if (status) queryParams.status = status;
        if (uploaded_at) queryParams.uploaded_at = uploaded_at;
        if (size) queryParams.size = size;
        if (document_id) queryParams.document_id = document_id;
        if (page) queryParams.page = page;
        if (q) queryParams.q = q;

        return {
          url: `/documents`,
          params: queryParams,
        };
      },
      providesTags: ["Documents"],
    }),

    deleteDocument: build.mutation<void, DeleteParams>({
      query: ({ id, workgroup_id }) => ({
        url: `/workgroups/${workgroup_id}/documents/${id}?lang=en`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
    getDocument: build.query<
      DocumentResponse,
      { workgroupId: string; documentId: number }
    >({
      query: ({ workgroupId, documentId }) =>
        `/workgroups/${workgroupId}/documents/${documentId}?lang=en`,
      providesTags: (_result, _error, { documentId }) => [
        { type: "Documents", id: documentId },
      ],
    }),
    getDeliverables: build.query<DeliverablesResponse, string>({
      query: (workgroupId) => `/workgroups/${workgroupId}/deliverables?lang=en`,
    }),

    updateDocument: build.mutation<
      void,
      { workgroupId: string; documentId: number; formData: FormData }
    >({
      query: ({ workgroupId, documentId, formData }) => ({
        url: `/workgroups/${workgroupId}/documents/${documentId}?lang=en`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: "Documents", id: documentId },
        "Documents",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
  useGetDocumentQuery,
  useGetDeliverablesQuery,
  useUpdateDocumentMutation,
} = documentService;
