"use client";

import { RefreshCw } from "lucide-react";
import { ButtonAction } from "./Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel/carousel";

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
      <CarouselContent>
        {isLoading &&
          Array.from({ length: 14 }).map((_, i) => (
            <CarouselItem key={i}>
              <ButtonAction className="animate-pulse w-25">&nbsp;</ButtonAction>
            </CarouselItem>
          ))}
        {!isLoading && (
          <CarouselItem onClick={() => onSelect?.(null)}>
            <ButtonAction active={true}>All</ButtonAction>
          </CarouselItem>
        )}

        {!isLoading &&
          data.map((item) => (
            <CarouselItem key={item.id} onClick={() => onSelect?.(item.id)}>
              <ButtonAction>{item.name}</ButtonAction>
            </CarouselItem>
          ))}
      </CarouselContent>
      {!isLoading && (
        <>
          <CarouselPrevious className="disabled:hidden" />
          <CarouselNext className="disabled:hidden" />
        </>
      )}
    </Carousel>
  );
};
