import { APIResponse, Pagination } from "../types";

export type Document = {
  id: number;
  deliverable_id: number;
  workgroup_id: number;
  title: string;
  description: string;
  title_ar: string;
  description_ar: string;
  original_name: string;
  file_url: string;
  size: number;
  created_by: number;
  public_at: string;
  status: string;
  created_at: string;
  workgroup_name: string;
  workgroup_name_ar: string;
  deliverable_name: string;
  deliverable_name_ar: string;
  workgroup_logo_url: string;
  creator_avatar_url: string;
  creator_name: string;
  can_update: boolean;
  can_delete: boolean;
  is_admin: boolean;
};

export type DocumentResponse = APIResponse<{ document: Document }>;

export type DocumentsResponse = APIResponse<{
  documents: Document[];
  pagination: Pagination;
}>;

export type DocumentParams = {
  workgroup?: number;
  document_id?: number;
};
