import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EditorDocumentType, DeliverableType } from "./types";
import { APIResponse } from "../types";

export const editorApi = createApi({
  reducerPath: "editorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dev-portal.safta.sa/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("userToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDocumentData: builder.query<
      APIResponse<EditorDocumentType>,
      { workgroup_id: string; document_id: number }
    >({
      query: ({ workgroup_id, document_id }) =>
        `/workgroups/${workgroup_id}/documents/${document_id}?lang=en`,
    }),
    getDeliverables: builder.query<
      APIResponse<DeliverableType[]>,
      { workgroup_id: string }
    >({
      query: ({ workgroup_id }) =>
        `/workgroups/${workgroup_id}/deliverables?lang=en`,
    }),
    updateDocument: builder.mutation<
      APIResponse<EditorDocumentType>,
      { workgroup_id: string; document_id: number; data: FormData }
    >({
      query: ({ workgroup_id, document_id, data }) => ({
        url: `/workgroups/${workgroup_id}/documents/${document_id}?lang=en`,
        method: "PATCH",
        body: data,
        headers: { "Content-Type": "multipart/form-data" },
      }),
    }),
  }),
});

export const {
  useGetDocumentDataQuery,
  useGetDeliverablesQuery,
  useUpdateDocumentMutation,
} = editorApi;
