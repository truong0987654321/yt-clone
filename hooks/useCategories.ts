import { qKeys } from "@/lib/queryClient";
import { Category } from "@/lib/types";
import {
  categoryService,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/services/category.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook lấy danh sách tất cả Categories
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: qKeys.categories.all,
    queryFn: categoryService.getAll,
  });
}

/**
 * Hook lấy thông tin chi tiết 1 Category theo ID
 */
export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: qKeys.categories.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook tạo Category mới
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCategoryDTO) => categoryService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKeys.categories.all });
    },
  });
}

/**
 * Hook cập nhật Category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDTO }) =>
      categoryService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: qKeys.categories.all });
      queryClient.invalidateQueries({
        queryKey: qKeys.categories.detail(variables.id),
      });
    },
  });
}

/**
 * Hook xóa Category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qKeys.categories.all });
    },
  });
}
