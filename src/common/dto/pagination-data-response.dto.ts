export class PaginationDataResponseDto<T> {
  total: number;
  page: number;
  lastPage: number;
  data: T[];

  constructor(total: number, page: number, lastPage: number, data: T[]) {
    this.total = total;
    this.page = page;
    this.lastPage = lastPage;
    this.data = data;
  }
}
