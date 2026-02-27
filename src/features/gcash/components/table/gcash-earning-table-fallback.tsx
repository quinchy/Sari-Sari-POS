"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { RepeatIcon } from "@hugeicons/core-free-icons";

const SKELETON_ROWS = 5;
const COLUMNS_COUNT = 2;

export function TbodyFallback() {
  return (
    <>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
          <TableRow key={`skeleton-row-${rowIdx}`}>
            {Array.from({ length: COLUMNS_COUNT }).map((_, colIdx) => (
              <TableCell key={`skeleton-cell-${rowIdx}-${colIdx}`}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={COLUMNS_COUNT} className="first:border-b-0">
            <Skeleton className="h-5 w-32" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </>
  );
}

export function TbodyError({ resetAction }: { resetAction?: () => void }) {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={COLUMNS_COUNT}
          className="text-center h-[calc(100svh-15rem)] border-0"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div>
              <p className="font-semibold mb-1">
                Failed to load GCash earnings
              </p>
              <p className="text-sm text-muted-foreground">
                {resetAction
                  ? "An error occurred. Please try again."
                  : "Please refresh the page and try again."}
              </p>
            </div>
            {resetAction && (
              <Button variant="outline" onClick={resetAction}>
                <HugeiconsIcon
                  icon={RepeatIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
                Try again
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export function TbodyNoData() {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={COLUMNS_COUNT}
          className="text-center h-[calc(100svh-15rem)] border-0"
        >
          <p className="font-semibold mb-1">No GCash earnings found.</p>
          <p className="text-sm text-muted-foreground">
            Add a new GCash earning to get started.
          </p>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
