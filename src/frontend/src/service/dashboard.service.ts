import { api } from "./api";
import type { DashboardDTO } from "../types/dashboard";

export async function getDashboardOverview(): Promise<DashboardDTO> {
  const response = await api.get<{ data: DashboardDTO }>("/dashboard/overview");
  return response.data;
}
