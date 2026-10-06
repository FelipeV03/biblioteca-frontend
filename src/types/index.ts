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

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type LoanStatus = "active" | "returned";
export type LoanDisplayStatus = "active" | "overdue" | "returned";

export interface Loan {
  id: number;
  bookId: number;
  userId: number;
  loanDate: string;
  dueDate: string;
  returnedAt: string | null;
  status: LoanStatus;
  displayStatus: LoanDisplayStatus;
  book?: Book;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TopBook {
  bookId: number;
  title: string;
  author: string;
  genre: string;
  loanCount: number;
}

export interface LoansSummary {
  active: number;
  overdue: number;
  returned: number;
  total: number;
}

export interface GenreAvailability {
  genre: string;
  total: number;
  available: number;
  borrowed: number;
}

export interface AverageLoanDuration {
  averageDays: number | null;
  sampleSize: number;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
