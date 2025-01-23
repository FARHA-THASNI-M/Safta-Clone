export interface Workgroup {
  id: string;
  name: string;
}

export interface WorkgroupsResponse {
  data: {
    workgroups: Workgroup[];
  };
}

export interface WorkgroupParams {
  lang?: string;
}
