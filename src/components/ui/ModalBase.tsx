import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogPortal,
} from "@/components/shadcnOrigin/dialog";
import { Button } from "@/components/shadcnOrigin/button";
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
  disablePointerDismissal = false,
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
            "top-[calc(50%+40px)]",
            "max-h-[calc(100vh-200px)]",
            "translate-y-[-50%]",

            "overflow-y-auto border border-slate-100 bg-white px-6 py-10 shadow-2xl outline-none",
            contentClassName,
            "gap-0!",
          )}
          showCloseButton={false}
        >
          <div className="flex items-center justify-between px-8 py-4 sm:px-12">
            <DialogTitle className={cn("text-slate-950", titleClassName)}>
              {title}
            </DialogTitle>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="fixed top-5 right-4 cursor-pointer rounded-full bg-slate-100 hover:bg-slate-200"
                />
              }
            >
              <XIcon size={20} />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className="px-8 sm:px-12">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
