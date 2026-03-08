"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { RepeatIcon } from "@hugeicons/core-free-icons";

export function TBodyLoading({
  columnsCount = 2,
  rowsCount = 15,
}: {
  columnsCount?: number;
  rowsCount?: number;
}) {
  return (
    <>
      <TableBody>
        {Array.from({ length: rowsCount }).map((_, rowIdx) => (
          <TableRow key={`skeleton-row-${rowIdx}`}>
            {Array.from({ length: columnsCount }).map((_, colIdx) => (
              <TableCell key={`skeleton-cell-${rowIdx}-${colIdx}`}>
                <Skeleton className="h-11 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export function TBodyError({
  title = "Failed to load the data",
  description = "An error occured. Please try again.",
  columnsCount = 2,
  resetAction,
}: {
  title?: string;
  description?: string;
  columnsCount?: number;
  resetAction?: () => void;
}) {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columnsCount}
          className="text-center h-[calc(100svh-15rem)] border-0"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div>
              <h1 className="font-semibold mb-1">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
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

export function TBodyNoData({
  title = "No data found",
  description = "Add a new data to get started.",
  columnsCount = 2,
}: {
  title?: string;
  description?: string;
  columnsCount?: number;
}) {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columnsCount}
          className="text-center h-[calc(100svh-15rem)] border-0"
        >
          <h1 className="font-semibold mb-1">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
