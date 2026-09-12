import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { Category } from "@/lib/types";

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>(API_ROUTES.CATEGORY.GET_ALL);
    return data || [];
  },
  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<Category>(API_ROUTES.CATEGORY.GET_BY_ID(id));
    return data;
  },
  create: async (dto: CreateCategoryDTO): Promise<Category> => {
    const { data } = await api.post<Category>(API_ROUTES.CATEGORY.CREATE, dto);
    return data;
  },
  update: async (id: string, dto: UpdateCategoryDTO): Promise<Category> => {
    const { data } = await api.put<Category>(
      API_ROUTES.CATEGORY.UPDATE(id),
      dto,
    );
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.CATEGORY.DELETE(id));
  },
};
