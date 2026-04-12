import { api } from "./api";

export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

export async function getProfile(): Promise<Profile> {
  const response = await api.get<{ data: Profile }>("/user/profile");
  return response.data;
}

export async function updateProfile(data: {
  name?: string;
  avatar_url?: string;
}): Promise<Profile> {
  const response = await api.put<{ data: Profile }>("/user/profile", data);
  return response.data;
}

export async function changePassword(new_password: string): Promise<void> {
  await api.put("/user/password", { new_password });
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/user/account");
}
