"use client";

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetGCashEarningExtreme,
  useGetGCashEarningTotal,
} from "@/features/gcash/hooks/use-gcash-earning";

export default function GCashEarningAnalytics() {
  return (
    <main className="grid grid-cols-3 gap-4">
      <GCashEarningTotalCard />
      <GCashEarningHighestAmountCard />
      <GCashEarningLowestAmountCard />
    </main>
  );
}

export function GCashEarningTotalCard() {
  const { total, isTotalLoading } = useGetGCashEarningTotal();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Earning</CardTitle>
        <CardDescription>
          All accumulated GCash earning of all time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isTotalLoading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <h1 className="font-bold text-4xl">₱{total.toLocaleString()}</h1>
        )}
      </CardContent>
    </Card>
  );
}

export function GCashEarningHighestAmountCard() {
  const { extreme, isExtremeLoading } = useGetGCashEarningExtreme("highest");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highest Earning</CardTitle>
        <CardDescription>
          The highest GCash earning of all time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isExtremeLoading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <h1 className="font-bold text-4xl text-emerald-600">
            ₱{extreme.amount.toLocaleString()}
          </h1>
        )}
      </CardContent>
    </Card>
  );
}

export function GCashEarningLowestAmountCard() {
  const { extreme, isExtremeLoading } = useGetGCashEarningExtreme("lowest");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lowest Amount</CardTitle>
        <CardDescription>The lowest GCash earning of all time.</CardDescription>
      </CardHeader>
      <CardContent>
        {isExtremeLoading ? (
          <Skeleton className="h-10 w-40" />
        ) : (
          <h1 className="font-bold text-4xl text-rose-600">
            ₱{extreme.amount.toLocaleString()}
          </h1>
        )}
      </CardContent>
    </Card>
  );
}
