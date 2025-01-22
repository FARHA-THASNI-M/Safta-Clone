export type APIResponse<T> = {
  message: string;
  data: T;
};

export type Pagination = {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginationParams = {
  page?: number;
  size?: number;
};
