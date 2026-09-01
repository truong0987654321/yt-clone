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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setActionError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setActionError(null);
    setSuccess(null);

    if (editingCategory) {
      // Update Mode
      updateCategoryMutation.mutate(
        {
          id: editingCategory.id,
          dto: {
            name: name.trim(),
            description: description.trim(),
          },
        },
        {
          onSuccess: () => {
            setSuccess(`Category "${name.trim()}" updated successfully.`);
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
          name: name.trim(),
          description: description.trim(),
        },
        {
          onSuccess: (newCat) => {
            setSuccess(`Category "${newCat.name}" created successfully.`);
            setName("");
            setDescription("");
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
    <div className="min-h-screen bg-background text-foreground p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
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
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between">
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
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 shrink-0" />
            <span className="text-sm font-medium">{success}</span>
          </div>

          <button onClick={() => setSuccess(null)}>
            <X className="size-5 opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 p-6 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {editingCategory ? (
                <>
                  <Pencil className="size-5 text-blue-500" />
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
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                  Description
                </label>

                <textarea
                  rows={3}
                  placeholder="Enter category description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium bg-background text-foreground border border-border rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
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
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-border hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold truncate">
                          {cat.name}
                        </h3>
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

                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground/70">
                        <span>
                          ID:{" "}
                          <code className="font-mono bg-btn-hover px-1.5 py-0.5 rounded text-[11px]">
                            {cat.id}
                          </code>
                        </span>

                        <span>
                          Created:{" "}
                          {new Date(cat.created_at).toLocaleDateString("en-US")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        title="Edit category"
                        className="p-2 rounded-xl hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="size-4.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleteCategoryMutation.isPending}
                        title="Delete category"
                        className="p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
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
    </div>
  );
}
