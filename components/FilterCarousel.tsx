"use client";

import { ButtonAction } from "./Button";
import { Carousel } from "./ui/carousel";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterCarouselProps {
  data: FilterOption[];
  isLoading?: boolean;
  onSelect?: (value: string | null) => void;
}

export const FilterCarousel = ({
  data,
  isLoading,
  onSelect,
}: FilterCarouselProps) => {
  return (
    <Carousel itemsToScroll={3} gap={12}>
      <Carousel.Content>
        {isLoading &&
          Array.from({ length: 14 }).map((_, i) => (
            <Carousel.Item key={i}>
              <ButtonAction className="animate-pulse w-25">&nbsp;</ButtonAction>
            </Carousel.Item>
          ))}
        {!isLoading && (
          <Carousel.Item onClick={() => onSelect?.(null)}>
            <ButtonAction active={true}>All</ButtonAction>
          </Carousel.Item>
        )}

        {!isLoading &&
          data.map((item) => (
            <Carousel.Item key={item.id} onClick={() => onSelect?.(item.id)}>
              <ButtonAction>{item.name}</ButtonAction>
            </Carousel.Item>
          ))}
      </Carousel.Content>
      {!isLoading && (
        <>
          <Carousel.Previous className="disabled:hidden" />
          <Carousel.Next className="disabled:hidden" />
        </>
      )}
    </Carousel>
  );
};
