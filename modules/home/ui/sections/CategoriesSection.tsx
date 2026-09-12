"use client";

import { AlertCircle } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { FilterCarousel } from "@/components/FilterCarousel";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";

interface CategoriesSectionProps {
  value?: string;
}

export const CategoriesSection = ({ value }: CategoriesSectionProps) => {
  const router = useRouter();
  const { t } = useI18n();

  const {
    data: categories = [],
    isLoading,
    error: fetchError,
  } = useCategories();

  if (fetchError) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-foreground-error">
        <AlertCircle className="size-5" />
        <span>{t("category.failed")}</span>
      </div>
    );
  }
  const onSelect = (val: string | null) => {
    const url = new URL(window.location.href);
    if (val) {
      url.searchParams.set("categoryId", val);
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
        value={value}
      />
    </div>
  );
};
