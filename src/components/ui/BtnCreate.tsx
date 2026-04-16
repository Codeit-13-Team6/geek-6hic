import { Button } from "@/components/ui/Button";
import { cn } from "@/lib";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BtnCreate({
  onClick,
  path,
  title,
}: {
  onClick?: () => void;
  path?: string;
  title: string;
}) {
  const ButtonContent = (
    <Button
      variant="default"
      onClick={onClick}
      className={cn(
        "fixed right-7 bottom-6 z-[99] sm:right-6 lg:right-15 lg:bottom-16",
        "w-auto !rounded-full border-white/30 text-white shadow-[0_20px_40px_rgba(38,6,86,0.3)] transition-all duration-300",
        "h-14 w-14 !p-0 sm:w-auto sm:gap-2.5 sm:!px-6",
        "group hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(38,6,86,0.5)]",
      )}
    >
      <Plus
        size={22}
        strokeWidth={2.5}
        className="transition-transform duration-300 group-hover:rotate-90"
      />
      <span className="hidden text-[13px] font-black tracking-widest uppercase sm:block">
        {title}
      </span>
    </Button>
  );

  if (path) {
    return (
      <Link href={path} aria-label={`${title} 페이지로 이동`}>
        {ButtonContent}
      </Link>
    );
  }

  return ButtonContent;
}
