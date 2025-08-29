export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;               // uuid
  description: string;
  amount: number;           // positive number; sign inferred from type
  category: string;         // e.g., "Food", "Rent", "Salary"
  date: string;             // ISO string (YYYY-MM-DD)
  type: TransactionType;    // 'income' | 'expense'
}