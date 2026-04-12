import { api } from "./api";

export interface Subscription {
  id: string;
  userId: string;
  accountId: string | null;
  categoryId: string | null;
  name: string;
  amount: string;
  billingCycle: string;
  nextBillingDate: string | null;
  active: boolean;
  createdAt: string;
}

interface SubscriptionListResponse {
  results: Subscription[];
  RowsAffected: number;
  RecordCount: number;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await api.get<SubscriptionListResponse>("/subscription/");
  return res.results ?? [];
}

export interface CreateSubscriptionPayload {
  name: string;
  amount: number;
  billing_cycle: string;
  next_billing_date?: string;
  account_id?: string;
  category_id?: string;
  active?: boolean;
}

export async function createSubscription(data: CreateSubscriptionPayload) {
  return api.post<{ data: Subscription }>("/subscription/", data);
}

export interface UpdateSubscriptionPayload {
  id: string;
  name?: string;
  amount?: number;
  billing_cycle?: string;
  next_billing_date?: string;
  account_id?: string;
  category_id?: string;
  active?: boolean;
}

export async function updateSubscription(data: UpdateSubscriptionPayload) {
  return api.put<{ data: Subscription }>("/subscription/", data);
}

export async function deleteSubscription(id: string) {
  return api.delete(`/subscription/${id}`);
}
