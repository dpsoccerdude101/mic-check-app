type PagedAndSortedRequest = {
  keyword?: string;
  maxResultCount: number;
  sorting: string;
  GenreIds?: number[]
  skipCount: number;
};

export default PagedAndSortedRequest;
