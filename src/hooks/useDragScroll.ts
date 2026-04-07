import { useRef } from "react";

export function useDragScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current!.offsetLeft;
    scrollLeft.current = scrollRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    isDragging.current = true;
    const x = e.pageX - scrollRef.current!.offsetLeft;
    scrollRef.current!.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.stopPropagation();
      isDragging.current = false;
    }
  };

  return {
    scrollRef,
    dragProps: {
      ref: scrollRef,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onClickCapture: handleClickCapture,
      style: { userSelect: "none" as const, WebkitUserDrag: "none" as const },
    },
  };
}
