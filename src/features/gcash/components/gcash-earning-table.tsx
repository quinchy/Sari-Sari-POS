"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { GCashEarningTableHeader } from "@/features/gcash/components/gcash-earning-table-header";
import { columns } from "@/features/gcash/lib/gcash-earning-table-columns";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const GCashEarningTableBody = dynamic(
  () => import("@/features/gcash/components/gcash-earning-table-body"),
  { ssr: false, loading: () => <TbodyFallback /> },
);

const GCashEarningTableFooter = dynamic(
  () => import("@/features/gcash/components/gcash-earning-table-footer"),
  { ssr: false, loading: () => null },
);

function TbodyFallback() {
  return (
    <>
      <TableBody>
        <TableRow>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-full" />
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="first:border-b-0">
            <Skeleton className="h-5 w-full" />
          </TableCell>
        </TableRow>
      </TableFooter>
    </>
  );
}

export default function GCashEarningTable() {
  return (
    <Table>
      <GCashEarningTableHeader />
      <Suspense fallback={<TbodyFallback />}>
        <GCashEarningTableBody />
        <GCashEarningTableFooter />
      </Suspense>
    </Table>
  );
}
