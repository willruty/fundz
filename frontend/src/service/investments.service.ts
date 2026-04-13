import { api } from "./api";

export interface ApiInvestment {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: string;
  annualRate: string;
  startDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentListResponse {
  results: ApiInvestment[];
  RowsAffected: number;
  RecordCount: number;
}

export interface CreateInvestmentInput {
  name: string;
  category: string;
  amount: number;
  annualRate: number;
  startDate?: string;
  notes?: string;
}

export interface UpdateInvestmentInput {
  id: string;
  name?: string;
  category?: string;
  amount?: number;
  annualRate?: number;
  startDate?: string;
  notes?: string;
}

export async function getInvestments(): Promise<ApiInvestment[]> {
  const res = await api.get<InvestmentListResponse>("/investment/");
  return res.results ?? [];
}

export async function createInvestment(input: CreateInvestmentInput): Promise<ApiInvestment> {
  return api.post<ApiInvestment>("/investment/", input);
}

export async function updateInvestment(input: UpdateInvestmentInput): Promise<ApiInvestment> {
  const res = await api.put<{ data: ApiInvestment }>("/investment/", input);
  return res.data;
}

export async function deleteInvestment(id: string): Promise<void> {
  await api.delete<{ data: string }>(`/investment/${id}`);
}
