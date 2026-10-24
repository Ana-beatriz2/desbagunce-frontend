export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function pageCount(page: Page<unknown>): number {
  return Math.max(1, Math.ceil(page.total / page.pageSize));
}
