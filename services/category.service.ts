import { api } from "@/lib/axios";
import { BFF_ROUTES } from "@/lib/constants";

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

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
    const { data } = await api.get<Category[]>(BFF_ROUTES.CATEGORY.GET_ALL);
    return data || [];
  },
  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<Category>(BFF_ROUTES.CATEGORY.GET_BY_ID(id));
    return data;
  },
  create: async (dto: CreateCategoryDTO): Promise<Category> => {
    const { data } = await api.post<Category>(BFF_ROUTES.CATEGORY.CREATE, dto);
    return data;
  },
  update: async (id: string, dto: UpdateCategoryDTO): Promise<Category> => {
    const { data } = await api.put<Category>(
      BFF_ROUTES.CATEGORY.UPDATE(id),
      dto,
    );
    return data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(BFF_ROUTES.CATEGORY.DELETE(id));
  },
};
