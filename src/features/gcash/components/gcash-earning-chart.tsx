"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";

export const description = "An interactive line chart of GCash Earnings";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function GCashEarningChart() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<string>(
    currentMonth.toString(),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );

  const selectedMonthLabel =
    MONTHS.find((m) => m.value === selectedMonth)?.label ?? "";

  const {
    gcashEarnings,
    isGCashEarningsLoading: isLoading,
    isGCashEarningsEmpty: isEmpty,
  } = useGetGCashEarning({
    year: parseInt(selectedYear),
    month: parseInt(selectedMonth),
  });

  const daysInMonth = useMemo(() => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    return new Date(year, month, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Fill in missing days with 0 amount
  const filledChartData = useMemo(() => {
    const toDateString = (date: Date | string) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const dataMap = new Map(
      gcashEarnings.map((d) => [toDateString(d.created_at), d.amount]),
    );
    const result: { date: string; amount: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${selectedMonth.padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      result.push({
        date: dateStr,
        amount: dataMap.get(dateStr) ?? 0,
      });
    }

    // Create new array reference to ensure re-render
    return [...result];
  }, [gcashEarnings, daysInMonth, selectedYear, selectedMonth]);

  const totalAmount = useMemo(
    () => filledChartData.reduce((acc, curr) => acc + curr.amount, 0),
    [filledChartData],
  );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-3 sm:py-6">
          <CardTitle>GCash Earning Chart</CardTitle>
          <CardDescription>
            Showing total earning for {selectedMonthLabel} {selectedYear}
          </CardDescription>
        </div>

        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Total Amount</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {isLoading ? (
                <Skeleton className="h-7 w-24 sm:h-8 sm:w-32" />
              ) : (
                `₱${totalAmount.toLocaleString()}`
              )}
            </span>
          </div>
        </div>
      </CardHeader>

      <div className="flex gap-2 px-6 py-3">
        <Select
          value={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value ?? "")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>{selectedMonthLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value ?? "")}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue>{selectedYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={filledChartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  formatter={(value) => `₱${Number(value).toLocaleString()}`}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey="amount"
              type="monotone"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
