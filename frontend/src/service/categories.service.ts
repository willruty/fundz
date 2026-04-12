import { api } from "./api";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: string;
  createdAt: string;
}

interface CategoryListResponse {
  results: Category[];
  RowsAffected: number;
  RecordCount: number;
}

export interface CreateCategoryInput {
  name: string;
  type: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  type?: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<CategoryListResponse>("/category/");
  return res.results ?? [];
}

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const res = await api.post<{ data: Category }>("/category/", input);
  return res.data;
}

export async function updateCategory(input: UpdateCategoryInput): Promise<Category> {
  const res = await api.put<{ data: Category }>("/category/", input);
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete<{ data: string }>(`/category/${id}`);
}
