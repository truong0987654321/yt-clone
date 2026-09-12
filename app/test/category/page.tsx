"use client";

import { useState } from "react";
import axios from "axios";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { Category } from "@/lib/types";
import { Scrollbar } from "@/components/ui/scrollbar";

interface ApiErrorResponse {
  message?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export default function CategoryTestPage() {
  // React Query Hooks
  const {
    data: categories = [],
    isLoading,
    isRefetching,
    refetch,
    error: fetchError,
  } = useCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Local UI states
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isCustomDescription, setIsCustomDescription] =
    useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Nếu người dùng chưa tự sửa description -> Tự động điền giá trị "Videos related to {name}"
    if (!isCustomDescription) {
      const trimmed = val.trim();
      setDescription(trimmed ? `Videos related to ${trimmed}` : "");
    }
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    // Khi người dùng chủ động gõ vào ô description -> Đánh dấu là tùy chỉnh thủ công
    setIsCustomDescription(true);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsCustomDescription(true);
    setActionError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIsCustomDescription(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Nếu không nhập description -> Tự động mặc định thành "Videos related to {name}"
    const finalDescription =
      description.trim() || `Videos related to ${trimmedName}`;

    setActionError(null);
    setSuccess(null);
    if (editingCategory) {
      // Update Mode
      updateCategoryMutation.mutate(
        {
          id: editingCategory.id,
          dto: {
            name: trimmedName,
            description: finalDescription,
          },
        },
        {
          onSuccess: () => {
            setSuccess(`Category "${trimmedName}" updated successfully.`);
            handleCancelEdit();
          },
          onError: (err: unknown) => {
            setActionError(
              getErrorMessage(err, "Failed to update the category."),
            );
          },
        },
      );
    } else {
      // Create Mode
      createCategoryMutation.mutate(
        {
          name: trimmedName,
          description: finalDescription,
        },
        {
          onSuccess: (newCat) => {
            setSuccess(`Category "${newCat.name}" created successfully.`);
            setName("");
            setDescription("");
            setIsCustomDescription(false);
          },
          onError: (err: unknown) => {
            setActionError(
              getErrorMessage(err, "Failed to create the category."),
            );
          },
        },
      );
    }
  };

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;

    setActionError(null);
    setSuccess(null);

    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        setSuccess(`Category "${catName}" deleted successfully.`);

        if (editingCategory?.id === id) {
          handleCancelEdit();
        }
      },
      onError: (err: unknown) => {
        setActionError(getErrorMessage(err, "Failed to delete the category."));
      },
    });
  };

  const error =
    actionError ||
    (fetchError
      ? getErrorMessage(
          fetchError,
          "Failed to load categories. Make sure the Go backend is running on port 8080.",
        )
      : null);

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <div className="min-h-screen max-h-screen bg-background text-foreground p-6 max-w-6xl mx-auto relative z-1">
      {/* Header */}
      <div className="flex max-mb:flex-col flex-row items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-600 rounded-xl">
              <FolderTree className="size-7" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Category Management (React Query Hooks Test)
              </h1>

              <p className="text-sm text-muted-foreground mt-0.5">
                Test CRUD operations with React Query hooks (useCategories,
                useCreateCategory, useUpdateCategory, useDeleteCategory)
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-btn-hover transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`size-4 ${
              isLoading || isRefetching ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Alert Messages */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-40 flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-150 bg-background">
          {error && (
            <div className="p-4 rounded-xl bg-background-error border border-border-error text-foreground-error flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>

              <button onClick={() => setActionError(null)}>
                <X className="size-5 opacity-70 hover:opacity-100" />
              </button>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-background-success border border-border-success text-foreground-success flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>

              <button onClick={() => setSuccess(null)}>
                <X className="size-5 opacity-70 hover:opacity-100" />
              </button>
            </div>
          )}
        </div>
      </div>
      <Scrollbar className="p-1" size={2}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[calc(100vh-13rem)]">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 p-6 rounded-2xl border border-border bg-card shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {editingCategory ? (
                  <>
                    <Pencil className="size-5 text-btn-action" />
                    Edit Category
                  </>
                ) : (
                  <>
                    <Plus className="size-5 text-brand-600" />
                    Add New Category
                  </>
                )}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter category name..."
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                    Description (Optional)
                  </label>

                  <textarea
                    rows={3}
                    placeholder={
                      name.trim()
                        ? `Default: "Videos related to ${name.trim()}"`
                        : "Enter description (Optional)..."
                    }
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim()}
                    className="flex-1 px-4 py-2.5 text-sm font-medium bg-background text-btn-action border border-border rounded-xl hover:bg-btn-action-hover transition-colors disabled:opacity-50 disabled:hover:bg-background "
                  >
                    {isSubmitting
                      ? "Processing..."
                      : editingCategory
                        ? "Save Changes"
                        : "Create Category"}
                  </button>

                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-btn-hover transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Categories ({categories.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-12 text-center border border-border rounded-2xl bg-card text-muted-foreground">
                <RefreshCw className="size-8 animate-spin mx-auto mb-3 opacity-60" />
                Loading categories with React Query...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-card text-muted-foreground">
                <FolderTree className="size-12 mx-auto mb-3 opacity-40" />
                No categories found. Create a new category using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-5 rounded-2xl border transition-all bg-card ${
                      editingCategory?.id === cat.id
                        ? "border-btn-action ring-1 ring-btn-action"
                        : "border-border hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {" "}
                          <h3 className="text-base font-semibold truncate">
                            {cat.name}
                          </h3>
                          {cat.slug && (
                            <span className="text-xs font-mono bg-brand-500/10 text-brand-600 px-2.5 py-0.5 rounded-full border border-brand-500/20 font-medium">
                              slug: {cat.slug}
                            </span>
                          )}
                        </div>

                        {cat.description ? (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {cat.description}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground/60 italic mt-1">
                            No description
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground/70">
                          <span>
                            Slug:{" "}
                            <code className="font-mono bg-btn-hover px-1.5 py-0.5 rounded text-[11px] text-brand-600 font-semibold">
                              {cat.slug || "-"}
                            </code>
                          </span>
                          <span>
                            ID:{" "}
                            <code className="font-mono bg-btn-hover px-1.5 py-0.5 rounded text-[11px]">
                              {cat.id}
                            </code>
                          </span>

                          <span>
                            Created:{" "}
                            {new Date(cat.created_at).toLocaleDateString(
                              "en-US",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          title="Edit category"
                          className="p-2 rounded-xl hover:bg-btn-action-hover text-muted-foreground hover:text-btn-action transition-colors"
                        >
                          <Pencil className="size-4.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          disabled={deleteCategoryMutation.isPending}
                          title="Delete category"
                          className="p-2 rounded-xl hover:bg-background-error text-muted-foreground hover:text-foreground-error transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="size-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
}
