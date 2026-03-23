
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/shadcnOrigin/dialog";
import { ReactNode } from "react";
import { Button } from "@/components/shadcnOrigin/button";
import { XIcon } from "lucide-react";

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
 *     <ModalBase
 *       isOpen={isOpen}
 *       onOpenChange={setIsOpen}
 *       title="모임 만들기"
 *       disablePointerDismissal
 *     >
 *       <div>모달 본문 내용</div>
 *     </ModalBase>
 *   </>
 * );
 */

interface ModalCommonProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children: ReactNode;
  title?: string;
  titleClassName?: string;
  contentClassName?: string;
  disablePointerDismissal?: boolean;
}

export default function ModalBase({
  isOpen,
  onOpenChange,
  children,
  title,
  contentClassName,
  titleClassName,
  // 바깥 영역 클릭으로 닫히지 않게 하려면 disablePointerDismissal 사용
  disablePointerDismissal = false,
}: ModalCommonProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogContent
        className={`${contentClassName} gap-0!`}
        showCloseButton={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          <DialogClose render={<Button variant="ghost" size="icon-sm" />}>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
