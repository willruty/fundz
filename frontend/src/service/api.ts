import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/fundz";
const GUEST_EMAIL = "visitante@fundz.app";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

async function request<T>(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown,
): Promise<T> {
  const session = await getSession();
  const token = session?.access_token ?? null;

  if (method !== "GET" && session?.user?.email === GUEST_EMAIL) {
    toast.error("Conta visitante — apenas visualização permitida");
    throw new Error("guest_read_only");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, "GET"),
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),
  put: <T>(path: string, body: unknown) => request<T>(path, "PUT", body),
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};
