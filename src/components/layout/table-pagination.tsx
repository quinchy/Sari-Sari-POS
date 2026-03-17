"use client";

import { useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export interface TablePaginationProps {
  pageIndex: number;
  total: number;
  totalPages: number;
  limit?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  pageIndex,
  total,
  totalPages,
  limit = 15,
  isLoading = false,
  onPageChange,
}: TablePaginationProps) {
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const {
    firstPages,
    middlePages,
    lastPages,
    showStartEllipsis,
    showEndEllipsis,
  } = useMemo(() => {
    if (totalPages <= 4) {
      return {
        firstPages: Array.from({ length: totalPages }, (_, i) => i),
        middlePages: [],
        lastPages: [],
        showStartEllipsis: false,
        showEndEllipsis: false,
      };
    }

    if (pageIndex <= 2) {
      // At the beginning: show 1, 2, 3, 4, ..., 25
      return {
        firstPages: [0, 1, 2, 3],
        middlePages: [],
        lastPages: [totalPages - 1],
        showStartEllipsis: false,
        showEndEllipsis: true,
      };
    }

    if (pageIndex >= totalPages - 3) {
      // At the end: show 1, ..., 22, 23, 24, 25
      return {
        firstPages: [0],
        middlePages: [],
        lastPages: [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        ],
        showStartEllipsis: true,
        showEndEllipsis: false,
      };
    }

    // In the middle: show first page, ellipsis, middle pages, ellipsis, last page
    return {
      firstPages: [0],
      middlePages: [pageIndex - 1, pageIndex, pageIndex + 1],
      lastPages: [totalPages - 1],
      showStartEllipsis: true,
      showEndEllipsis: true,
    };
  }, [pageIndex, totalPages]);

  const renderPageLink = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onPageChange(page);
        }}
        isActive={pageIndex === page}
      >
        {page + 1}
      </PaginationLink>
    </PaginationItem>
  );

  // Calculate showing from and to
  const showingFrom = totalPages > 0 ? pageIndex * limit + 1 : 0;
  const showingTo = Math.min((pageIndex + 1) * limit, total);

  return (
    <TableRow className="flex items-center justify-between w-full">
      <TableCell className="border-0">
        {isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">{showingFrom}</span> to{" "}
            <span className="font-bold text-foreground">{showingTo}</span> of{" "}
            <span className="font-bold text-foreground">{total}</span> records
          </p>
        )}
      </TableCell>
      <TableCell className="border-0">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canPreviousPage) {
                    onPageChange(pageIndex - 1);
                  }
                }}
                aria-disabled={!canPreviousPage}
              />
            </PaginationItem>
            {firstPages.map(renderPageLink)}
            {showStartEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {middlePages.map(renderPageLink)}
            {showEndEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {lastPages.map(renderPageLink)}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (canNextPage) {
                    onPageChange(pageIndex + 1);
                  }
                }}
                aria-disabled={!canNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </TableCell>
    </TableRow>
  );
}
