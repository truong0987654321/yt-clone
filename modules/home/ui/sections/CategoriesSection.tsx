"use client";

import { AlertCircle } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { FilterCarousel } from "@/components/FilterCarousel";
import { useRouter } from "next/navigation";

export const CategoriesSection = () => {
  const router = useRouter();
  const {
    data: categories = [],
    isLoading,
    error: fetchError,
  } = useCategories();

  if (fetchError) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <AlertCircle className="size-5" />
        <span>Failed to load categories.</span>
      </div>
    );
  }
  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.pathname + url.search);
  };

  return (
    <div>
      <FilterCarousel
        onSelect={onSelect}
        isLoading={isLoading}
        data={categories}
      />
    </div>
  );
};
