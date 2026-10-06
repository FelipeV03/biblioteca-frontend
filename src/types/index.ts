export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string | null;
  publishedYear: number | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
