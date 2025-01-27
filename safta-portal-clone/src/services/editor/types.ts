export type EditorDocumentType = {
  id: number;
  title: string;
  title_ar: string;
  deliverable?: string;
  description?: string;
  description_ar?: string;
  isPublic?: boolean;
  workgroup_id: string;
};

export type EditorDocumentFile = {
  original_name: string;
  file_url: string;
};

export type DeliverableType = {
  id: number;
  name: string;
};
