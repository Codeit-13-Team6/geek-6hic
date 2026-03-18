"use client";

import { Dialog, DialogContent } from "@/components/shadcnOrigin/dialog";
import { ReactNode } from "react";

/**
 * 예시)
 * const [isOpen, setIsOpen] = useState(false);
 *
 * return (
 *   <>
 *     <Button type="button" onClick={() => setIsOpen(true)}>
 *       모달 열기
 *     </Button>
 *
 *     <ModalCommon
 *       isOpen={isOpen}
 *       onOpenChange={setIsOpen}
 *       disablePointerDismissal
 *     >
 *       <DialogHeader>
 *         <DialogTitle>모임 만들기</DialogTitle>
 *         <DialogDescription>
 *           모임 정보를 입력해주세요.
 *         </DialogDescription>
 *       </DialogHeader>
 *
 *       <div className="pt-5">모달 본문 내용</div>
 *     </ModalCommon>
 *   </>
 * );
 */

interface ModalCommonProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
  disablePointerDismissal?: boolean;
}

export default function ModalCommon({
  isOpen,
  onOpenChange,
  children,
  contentClassName,
  // 바깥 영역 클릭으로 닫히지 않게 하려면 disablePointerDismissal 사용
  disablePointerDismissal = false,
}: ModalCommonProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogContent className={contentClassName}>{children}</DialogContent>
    </Dialog>
  );
}
