import { useEffect, useState, RefObject } from "react";

type Position = { x: number; y: number };
export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export function useFloatingPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  spacing = 8,
  placement: Placement = "bottom",
): { position: Position; hasPosition: boolean } {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [hasPosition, setHasPosition] = useState(false);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerEl = triggerRef.current!;
      const triggerRect = triggerEl.getBoundingClientRect();
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const contentHeight = contentEl.offsetHeight;
      const contentWidth = contentEl.offsetWidth;

      let x = triggerRect.left;
      let y = triggerRect.top;

      switch (placement) {
        case "bottom":
          x = triggerRect.left;
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "top":
          x = triggerRect.left;
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;

        case "right":
          x = triggerRect.right + spacing;
          y = triggerRect.top;
          if (x + contentWidth > window.innerWidth) {
            x = Math.max(triggerRect.left - contentWidth - spacing, spacing);
          }
          break;

        case "left":
          x = triggerRect.left - contentWidth - spacing;
          y = triggerRect.top;
          if (x < spacing) {
            x = Math.min(
              triggerRect.right + spacing,
              window.innerWidth - contentWidth - spacing,
            );
          }
          break;
        case "bottom-left":
          x = triggerRect.right - contentWidth; // align phải với trigger
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "bottom-right":
          x = triggerRect.left; // align trái với trigger
          y = triggerRect.bottom + spacing;
          if (y + contentHeight > window.innerHeight) {
            y = Math.max(triggerRect.top - contentHeight - spacing, spacing);
          }
          break;

        case "top-left":
          x = triggerRect.right - contentWidth; // align phải với trigger
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;

        case "top-right":
          x = triggerRect.left; // align trái với trigger
          y = triggerRect.top - contentHeight - spacing;
          if (y < spacing) {
            y = Math.min(
              triggerRect.bottom + spacing,
              window.innerHeight - contentHeight - spacing,
            );
          }
          break;
      }

      if (x + contentWidth > window.innerWidth - spacing) {
        x = window.innerWidth - contentWidth - spacing;
      }
      if (x < spacing) x = spacing;

      if (y + contentHeight > window.innerHeight - spacing) {
        y = window.innerHeight - contentHeight - spacing;
      }
      if (y < spacing) y = spacing;

      setPosition({ x, y });
      setHasPosition(true);
    };

    requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, triggerRef, contentRef, spacing, placement]);

  return { position, hasPosition };
}
