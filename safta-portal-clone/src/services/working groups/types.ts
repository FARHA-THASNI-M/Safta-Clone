export type Workgroup = {
  id: string;
  name: string;
};

export type WorkgroupsResponse = {
  data: {
    workgroups: Workgroup[];
  };
};

export type WorkgroupParams = {
  lang?: string;
};
