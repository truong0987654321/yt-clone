"use client";

import { useI18n, type Cle } from "@/i18n/context";
import { ButtonCategory } from "./Button";
import { Carousel } from "./ui/carousel";

interface FilterOption {
  id: string;
  name: string;
  slug?: string;
}

interface FilterCarouselProps {
  data: FilterOption[];
  isLoading?: boolean;
  onSelect?: (value: string | null) => void;
  value?: string | null;
}

const getCategoryItem = (t: ReturnType<typeof useI18n>["t"]) => ({
  category: [
    {
      id: "recentlyUploaded",
      label: t("category.recentlyUploaded"),
    },
    {
      id: "watched",
      label: t("category.watched"),
    },
  ],
});

export const FilterCarousel = ({
  data,
  isLoading,
  onSelect,
  value,
}: FilterCarouselProps) => {
  const { t } = useI18n();

  const { category } = getCategoryItem(t);

  const getCategoryName = (item: FilterOption) => {
    if (item.slug) {
      const key = `category.${item.slug}` as Cle;
      const translated = t(key);
      if (translated) return translated;
    }
    return item.name;
  };

  return (
    <Carousel itemsToScroll={3} gap={12}>
      <Carousel.Content>
        {isLoading &&
          Array.from({ length: 14 }).map((_, i) => (
            <Carousel.Item key={i}>
              <ButtonCategory className="animate-pulse w-25">
                &nbsp;
              </ButtonCategory>
            </Carousel.Item>
          ))}
        {!isLoading && (
          <Carousel.Item onClick={() => onSelect?.(null)}>
            <ButtonCategory active={!value}>{t("category.all")}</ButtonCategory>
          </Carousel.Item>
        )}

        {!isLoading &&
          data.map((item) => (
            <Carousel.Item key={item.id} onClick={() => onSelect?.(item.id)}>
              <ButtonCategory active={value === item.id}>
                {getCategoryName(item)}
              </ButtonCategory>
            </Carousel.Item>
          ))}

        {!isLoading && (
          <>
            {category.map((item) => (
              <Carousel.Item key={item.id} onClick={() => onSelect?.(item.id)}>
                <ButtonCategory>{item.label}</ButtonCategory>
              </Carousel.Item>
            ))}
          </>
        )}
      </Carousel.Content>
      {!isLoading && (
        <>
          <Carousel.Previous
            className="disabled:hidden"
            content={t("app.Previous")}
          />
          <Carousel.Next className="disabled:hidden" content={t("app.next")} />
        </>
      )}
    </Carousel>
  );
};
