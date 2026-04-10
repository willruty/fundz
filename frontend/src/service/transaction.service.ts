import { api } from "./api";

export interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: string;
  occurred_at: string;
}

export interface TransactionListResponse {
  results: Transaction[];
  RowsAffected: number;
  RecordCount: number;
}

export interface CreateTransactionInput {
  description: string;
  amount: string;
  type: string;
  occurred_at: string;
}

export interface UpdateTransactionInput extends CreateTransactionInput {
  id: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get<TransactionListResponse>("/transaction/");
  return response.results ?? [];
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<Transaction> {
  const response = await api.post<{ data: Transaction }>("/transaction/", {
    ...input,
    occurred_at: `${input.occurred_at}T00:00:00Z`,
  });
  return response.data;
}

export async function updateTransaction(
  input: UpdateTransactionInput,
): Promise<Transaction> {
  const response = await api.put<{ data: Transaction }>("/transaction/", {
    ...input,
    occurred_at: input.occurred_at.includes("T")
      ? input.occurred_at
      : `${input.occurred_at}T00:00:00Z`,
  });
  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transaction/${id}`);
}
