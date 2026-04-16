import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { XIcon } from "lucide-react";
import { ModalCommonProps } from "@/types";
import { cn } from "@/lib/utils";

export default function ModalBase({
  isOpen,
  onOpenChange,
  children,
  title,
  contentClassName,
  titleClassName,
  disablePointerDismissal = true,
}: ModalCommonProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      disablePointerDismissal={disablePointerDismissal}
    >
      <DialogPortal>
        <DialogContent
          className={cn(
            "fixed left-[50%] z-30 w-full max-w-[90%] translate-x-[-50%]",
            "max-h-[calc(100vh-100px)]",
            "translate-y-[-50%]",

            "overflow-y-auto border border-slate-100 bg-white shadow-2xl outline-none px-6 py-8 lg:px-16",
            contentClassName,
            "gap-0!",
          )}
          showCloseButton={false}
        >
          <DialogTitle className={cn("text-slate-950", titleClassName)}>
            {title}
          </DialogTitle>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="fixed top-10 right-10 rounded-full bg-slate-100 hover:bg-slate-200"
              />
            }
          >
            <XIcon size={20} />
            <span className="sr-only">닫기</span>
          </DialogClose>

          <div>{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
