import { useRef } from "react";

interface UseDragScrollOptions {
  dragDistanceThreshold?: number;
}

// 드래그 후 마우스를 영역 밖에서 놓으면 isDragging 값이 남아
// 다음 클릭까지 막히는 문제가 있어서 이를 정리하는 로직을 추가했습니다.
// 또한 dragDistanceThreshold 옵션으로 클릭과 드래그를 더 안정적으로 구분합니다.

export function useDragScroll(options: UseDragScrollOptions = {}) {
  // 클릭과 드래그를 구분하기 위해 최소 이동 거리(px)를 둡니다.
  const { dragDistanceThreshold = 0 } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isDragging = useRef(false);

  // clickCapture가 없는 종료 케이스에서도 drag 상태가 남지 않도록 다음 tick에 정리합니다.
  const dragResetTimer = useRef<number | null>(null);

  function clearDragResetTimer() {
    // 이미 예약된 drag 상태 정리 타이머가 있으면 취소합니다.
    if (dragResetTimer.current === null) return;

    window.clearTimeout(dragResetTimer.current);
    dragResetTimer.current = null;
  }

  function scheduleDragReset() {
    // clickCapture가 먼저 실행될 수 있도록 drag 상태 정리는 다음 tick으로 미룹니다.
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

    // threshold를 넘겼을 때만 클릭이 아닌 드래그로 판단합니다
    if (Math.abs(x - startX.current) > dragDistanceThreshold) {
      isDragging.current = true;
    }

    if (!isDragging.current) return;
    e.preventDefault();
    // 저장해둔 시작 스크롤 위치를 기준으로 현재 이동 거리만큼 좌우 스크롤합니다.
    scrollRef.current!.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const handleMouseUp = () => {
    isDown.current = false;

    // 컨테이너 밖에서 마우스를 놓아도 drag 상태가 다음 클릭까지 남지 않도록 정리합니다.
    if (isDragging.current) {
      scheduleDragReset();
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    // 드래그 직후 발생한 클릭에서는 링크 이동과 상위 전파를 모두 막습니다.
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
      style: { userSelect: "none" as const, WebkitUserDrag: "none" as const },
    },
  };
}
