import AppHeader from "@/components/layout/app-header";
import { GCashEarningChart } from "@/features/gcash/components/gcash-earning-chart";
import GCashToolbar from "@/features/gcash/components/gcash-toolbar";
import GCashEarningTable from "@/features/gcash/components/table/gcash-earning-table";
import GCashEarningAnalytics from "@/features/gcash/components/gcash-earning-analytics";

export default function GCashPage() {
  return (
    <main className="flex flex-col gap-4">
      <AppHeader
        title="GCash Earnings"
        description="Monitor and manage your GCash fee revenue with daily summaries and detailed records."
      />
      <GCashToolbar />
      <GCashEarningAnalytics />
      <GCashEarningChart />
      <GCashEarningTable />
    </main>
  );
}
