// ==================== COMMON API TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
