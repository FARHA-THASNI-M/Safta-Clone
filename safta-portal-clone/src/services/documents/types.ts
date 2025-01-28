import { APIResponse, Pagination } from "../types";

export type Document = {
  id: number;
  deliverable_id: number | null;
  workgroup_id: string;
  title: string;
  description: string | null;
  title_ar: string | null;
  description_ar: string | null;
  original_name: string;
  file_url: string;
  mime_type: string;
  size: number;
  created_by: string;
  approved_at: string | null;
  rejected_at: string | null;
  note: string | null;
  public_at: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  workgroup_name: string;
  workgroup_name_ar: string;
  deliverable_name: string | null;
  deliverable_name_ar: string | null;
  workgroup_logo_url: string | null;
  creator_avatar_url: string | null;
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
  workgroup?: string;
  document_id?: string;
  status?: string;
  uploaded_at?: string;
  q?: string;
};

export type DeleteParams = {
  id: number;
  workgroup_id: number | string;
};

export type Deliverable = {
  id: number;
  name: string;
};

export type DeliverablesResponse = APIResponse<{
  deliverables: Deliverable[];
}>;

export type CreateDocumentRequest = {
  workgroupId: string;
  formData: FormData;
};

export type PublishDocumentRequest = {
  workgroupId: string;
  documentId: number;
};

export interface DocumentFormData {
  id: number;
  title: string;
  title_ar: string;
  deliverable: string;
  description: string;
  description_ar: string;
  isPublic: boolean;
  workgroup_id: string;
}
