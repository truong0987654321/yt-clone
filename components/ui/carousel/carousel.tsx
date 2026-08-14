import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
interface CarouselContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  canPrev: boolean;
  canNext: boolean;
  hasOverflow: boolean;
  next: () => void;
  prev: () => void;
  scrollToRatio: (ratio: number) => void;
  activePage: number;
  pageCount: number;
  gap: number;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel(): CarouselContextValue {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error(
      "All Carousel.* components must be placed inside <Carousel>.",
    );
  }
  return ctx;
}

type CarouselType = React.HTMLAttributes<HTMLDivElement>;
interface CarouselProps extends CarouselType {
  loop?: boolean;
  autoPlay?: number | false;
  itemsPerView?: number;
  gap?: number;
  itemsToScroll?: number;
  onIndexChange?: (index: number) => void;
}

export const Carousel = ({
  children,
  loop = false,
  autoPlay = false,
  gap = 16,
  itemsToScroll = 1,
  className,
  ...props
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // Đo trạng thái cuộn thực tế từ DOM — nguồn sự thật duy nhất cho việc
  // ẩn/hiện & bật/tắt nút, không suy đoán qua số lượng item nữa.
  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setHasOverflow(maxScroll > 1);
    setCanPrev(scrollLeft > 1);
    setCanNext(scrollLeft < maxScroll - 1);
    setPageCount(
      Math.max(1, Math.round(scrollWidth / Math.max(clientWidth, 1))),
    );
    setActivePage(clientWidth > 0 ? Math.round(scrollLeft / clientWidth) : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    measure();

    const onScroll = () => measure();
    el.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    // Theo dõi luôn nội dung bên trong (số lượng / kích thước item đổi)
    Array.from(el.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      el.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, [measure, children]);

  const scrollByPage = useCallback(
    (direction: 1 | -1) => {
      const el = scrollRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;

      // Hết chỗ cuộn theo hướng đang đi -> nếu loop thì nhảy về đầu/cuối,
      // không thì thôi (không làm gì, vì nút cũng đã bị disable/ẩn rồi).
      if (direction === 1 && scrollLeft >= maxScroll - 1) {
        if (loop) el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      if (direction === -1 && scrollLeft <= 1) {
        if (loop) el.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }

      // Tìm đúng vị trí bắt đầu (left) của các item, dừng lại ở ranh giới
      // item thứ `itemsToScroll` kể từ item hiện tại -> không cắt item
      // làm đôi, và có thể nhảy nhanh qua vài item nếu itemsToScroll > 1.
      const containerLeft = el.getBoundingClientRect().left;
      const itemPositions = Array.from(el.children).map((child) => {
        const rect = (child as HTMLElement).getBoundingClientRect();
        return rect.left - containerLeft + scrollLeft;
      });

      let target: number;
      if (direction === 1) {
        const startIdx = itemPositions.findIndex((p) => p > scrollLeft + 1);
        if (startIdx === -1) {
          target = maxScroll;
        } else {
          const idx = Math.min(
            startIdx + itemsToScroll - 1,
            itemPositions.length - 1,
          );
          target = itemPositions[idx];
        }
      } else {
        let lastIdx = -1;
        for (let i = itemPositions.length - 1; i >= 0; i--) {
          if (itemPositions[i] < scrollLeft - 1) {
            lastIdx = i;
            break;
          }
        }
        if (lastIdx === -1) {
          target = 0;
        } else {
          const idx = Math.max(lastIdx - (itemsToScroll - 1), 0);
          target = itemPositions[idx];
        }
      }

      // Dùng scrollTo({behavior:"smooth"}) NGUYÊN BẢN của trình duyệt thay
      // vì animate tự viết bằng requestAnimationFrame — bản tự viết chạy
      // song song/ đè lên cơ chế scroll-snap của CSS, gây cảm giác "trễ"
      // hoặc giật khi 2 bên tranh nhau kiểm soát scrollLeft. Native
      // scrollTo phối hợp đúng với scroll-snap nên mượt và tự nhiên hơn.
      el.scrollTo({
        left: Math.min(Math.max(target, 0), maxScroll),
        behavior: "smooth",
      });
    },
    [loop, itemsToScroll],
  );

  const next = useCallback(() => scrollByPage(1), [scrollByPage]);
  const prev = useCallback(() => scrollByPage(-1), [scrollByPage]);

  const scrollToRatio = useCallback((ratio: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: maxScroll * ratio, behavior: "smooth" });
  }, []);

  // auto play
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => next(), autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, next]);

  const value: CarouselContextValue = {
    scrollRef,
    canPrev,
    canNext,
    hasOverflow,
    next,
    prev,
    scrollToRatio,
    activePage,
    pageCount,
    gap,
  };

  return (
    <CarouselContext.Provider value={value}>
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

export const CarouselContent = ({
  children,
  className,
  style,
  ...props
}: CarouselType) => {
  const { scrollRef, gap } = useCarousel();

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex overflow-x-auto snap-x snap-mandatory scroll-smooth",
        // ẩn thanh cuộn nhưng vẫn cuộn được (chuột kéo, trackpad, vuốt)
        "scrollbar-none [&::-webkit-scrollbar]:hidden",
        className,
      )}
      style={{ gap: `${gap}px`, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CarouselItem = ({
  children,
  className,
  ...props
}: CarouselType) => {
  return (
    <div className={cn("shrink-0", className)} {...props}>
      {children}
    </div>
  );
};

export interface CarouselButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
  forceShow?: boolean;
}
export const CarouselPrevious = ({
  className,
  children,
  forceShow = false,
  ...props
}: CarouselButtonProps) => {
  const { prev, canPrev, hasOverflow } = useCarousel();

  if (!hasOverflow && !forceShow) return null;

  return (
    <button
      type="button"
      onClick={prev}
      disabled={!canPrev}
      aria-label="Slide trước"
      className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 z-10",
        "h-9 w-9 flex items-center justify-center rounded-full",
        "border border-gray-300 bg-white/90 shadow-sm",
        "hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed",
        "transition",
        className,
      )}
      {...props}
    >
      {children ?? <ChevronLeft size={18} />}
    </button>
  );
};

export const CarouselNext = ({
  className,
  children,
  forceShow = false,
  ...props
}: CarouselButtonProps) => {
  const { next, canNext, hasOverflow } = useCarousel();

  if (!hasOverflow && !forceShow) return null;

  return (
    <button
      type="button"
      onClick={next}
      disabled={!canNext}
      aria-label="Slide kế tiếp"
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 z-10",
        "h-9 w-9 flex items-center justify-center rounded-full",
        "border border-gray-300 bg-white/90 shadow-sm",
        "hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed",
        "transition",
        className,
      )}
      {...props}
    >
      {children ?? <ChevronRight size={18} />}
    </button>
  );
};
