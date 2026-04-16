import { useRef } from "react";

interface UseDragScrollOptions {
  dragDistanceThreshold?: number;
  dragSpeed?: number;
}

export function useDragScroll(options: UseDragScrollOptions = {}) {
  const { dragDistanceThreshold = 0, dragSpeed = 1.6 } = options;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);
  const dragResetTimer = useRef<number | null>(null);

  function clearDragResetTimer() {
    if (dragResetTimer.current === null) return;
    window.clearTimeout(dragResetTimer.current);
    dragResetTimer.current = null;
  }

  function scheduleDragReset() {
    clearDragResetTimer();
    dragResetTimer.current = window.setTimeout(() => {
      isDragging.current = false;
      dragResetTimer.current = null;
    }, 0);
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    clearDragResetTimer();
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current!.offsetLeft;
    scrollLeft.current = scrollRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;

    const x = e.pageX - scrollRef.current!.offsetLeft;
    const distance = x - startX.current;

    if (Math.abs(distance) > dragDistanceThreshold) {
      isDragging.current = true;
    }

    if (!isDragging.current) return;

    e.preventDefault();

    scrollRef.current!.scrollLeft =
      scrollLeft.current - distance * dragSpeed;
  };

  const handleMouseUp = () => {
    isDown.current = false;

    if (isDragging.current) {
      scheduleDragReset();
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging.current) {
      clearDragResetTimer();
      e.preventDefault();
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
      style: {
        userSelect: "none" as const,
        WebkitUserDrag: "none" as const,
      },
    },
  };
}