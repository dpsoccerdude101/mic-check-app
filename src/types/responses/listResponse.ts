type ListResponse<T> = {
  totalCount: number;
  items: T[]
};

export default ListResponse;
