import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/PaginationCommon";

interface NumberPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  href?: string;
  className?: string;
}

type VisiblePageItem = number | "ellipsis" | "ellipsis-left" | "ellipsis-right";

function getVisiblePages(currentPage: number, totalPageCount: number): VisiblePageItem[] {
  if (totalPageCount <= 5) {
    return Array.from({ length: totalPageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPageCount];
  }

  if (currentPage >= totalPageCount - 2) {
    return [1, "ellipsis", totalPageCount - 3, totalPageCount - 2, totalPageCount - 1, totalPageCount];
  }

  return [
    1,
    "ellipsis-left",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-right",
    totalPageCount,
  ];
}

export default function NumberPagination({
  page,
  totalPages,
  onPageChange,
  href = "#",
  className,
}: NumberPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const visiblePages = getVisiblePages(safePage, safeTotalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={href}
            disabled={safePage === 1}
            onClick={(event) => {
              event.preventDefault();
              if (safePage > 1) onPageChange(safePage - 1);
            }}
          />
        </PaginationItem>

        {visiblePages.map((value, index) => (
          <PaginationItem key={`${value}-${index}`}>
            {typeof value === "number" ? (
              <PaginationLink
                href={href}
                isActive={value === safePage}
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(value);
                }}
              >
                {value}
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={href}
            disabled={safePage === safeTotalPages}
            onClick={(event) => {
              event.preventDefault();
              if (safePage < safeTotalPages) onPageChange(safePage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
