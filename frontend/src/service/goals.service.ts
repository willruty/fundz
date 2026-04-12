import { api } from "./api";

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  dueDate: string | null;
  createdAt: string;
}

interface GoalListResponse {
  results: Goal[];
  RowsAffected: number;
  RecordCount: number;
}

export async function getGoals(): Promise<Goal[]> {
  const res = await api.get<GoalListResponse>("/goal/");
  return res.results ?? [];
}

export interface CreateGoalPayload {
  name: string;
  target_amount: number;
  current_amount?: number;
  due_date?: string;
}

export async function createGoal(data: CreateGoalPayload) {
  return api.post<{ data: Goal }>("/goal/", data);
}

export interface UpdateGoalPayload {
  id: string;
  name?: string;
  target_amount?: number;
  current_amount?: number;
  due_date?: string;
}

export async function updateGoal(data: UpdateGoalPayload) {
  return api.put<{ data: Goal }>("/goal/", data);
}

export async function deleteGoal(id: string) {
  return api.delete(`/goal/${id}`);
}

