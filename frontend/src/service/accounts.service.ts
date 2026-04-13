import { api } from "./api";

export interface ApiAccount {
  id: string;
  userId: string;
  name: string;
  type: string;
  balance: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AccountListResponse {
  results: ApiAccount[];
  RowsAffected: number;
  RecordCount: number;
}

export interface CreateAccountInput {
  name: string;
  type: string;
  balance?: number;
}

export interface UpdateAccountInput {
  id: string;
  name?: string;
  type?: string;
  balance?: number;
}

export async function getAccounts(): Promise<ApiAccount[]> {
  const res = await api.get<AccountListResponse>("/account/");
  return res.results ?? [];
}

export async function createAccount(input: CreateAccountInput): Promise<ApiAccount> {
  // Backend returns the account directly (not wrapped in { data }).
  return api.post<ApiAccount>("/account/", input);
}

export async function updateAccount(input: UpdateAccountInput): Promise<ApiAccount> {
  const res = await api.put<{ data: ApiAccount }>("/account/", input);
  return res.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete<{ data: string }>(`/account/${id}`);
}
