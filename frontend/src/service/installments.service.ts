import { api } from "./api";

export interface Installment {
  id: string;
  userId: string;
  accountId: string | null;
  categoryId: string | null;
  name: string;
  totalAmount: string;
  installmentAmount: string;
  totalInstallments: number;
  paidInstallments: number;
  startDate: string;
  billingDay: number;
  active: boolean;
  createdAt: string;
}

interface InstallmentListResponse {
  results: Installment[];
  RowsAffected: number;
  RecordCount: number;
}

export async function getInstallments(): Promise<Installment[]> {
  const res = await api.get<InstallmentListResponse>("/installment/");
  return res.results ?? [];
}

export interface CreateInstallmentPayload {
  name: string;
  total_amount: number;
  installment_amount: number;
  total_installments: number;
  paid_installments?: number;
  start_date: string;
  billing_day: number;
  account_id?: string;
  category_id?: string;
  active?: boolean;
}

export async function createInstallment(data: CreateInstallmentPayload) {
  return api.post<{ data: Installment }>("/installment/", data);
}

export interface UpdateInstallmentPayload {
  id: string;
  name?: string;
  total_amount?: number;
  installment_amount?: number;
  total_installments?: number;
  paid_installments?: number;
  start_date?: string;
  billing_day?: number;
  account_id?: string;
  category_id?: string;
  active?: boolean;
}

export async function updateInstallment(data: UpdateInstallmentPayload) {
  return api.put<{ data: Installment }>("/installment/", data);
}

export async function deleteInstallment(id: string) {
  return api.delete(`/installment/${id}`);
}
