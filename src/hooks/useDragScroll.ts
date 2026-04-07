import { useRef } from "react";

interface UseDragScrollOptions {
  dragDistanceThreshold?: number;
}

export function useDragScroll(options: UseDragScrollOptions = {}) {
  // 클릭과 드래그를 구분하기 위해 최소 이동 거리(px)를 둡니다.
  const { dragDistanceThreshold = 0 } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current!.offsetLeft;
    scrollLeft.current = scrollRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    const x = e.pageX - scrollRef.current!.offsetLeft;

    // threshold를 넘겼을 때만 클릭이 아닌 드래그로 판단합니다
    if (Math.abs(x - startX.current) > dragDistanceThreshold) {
      isDragging.current = true;
    }

    // threshold 이하의 미세한 움직임은 클릭으로 유지합니다.
    if (!isDragging.current) return;
    e.preventDefault();
    // 저장해둔 시작 스크롤 위치를 기준으로 현재 이동 거리만큼 좌우 스크롤합니다.
    scrollRef.current!.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };
  // 드래그 직후 클릭에서 링크 이동과 전파를 막는다
  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging.current) {
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
      style: { userSelect: "none" as const, WebkitUserDrag: "none" as const },
    },
  };
}
