import AppHeader from "@/components/app-header";
import GCashToolbar from "@/features/gcash/components/gcash-toolbar";
import GCashEarningTable from "@/features/gcash/components/gcash-earning-table";

export default function GCashPage() {
  return (
    <main className="flex flex-col gap-4">
      <AppHeader
        title="GCash Earnings"
        description="Monitor and manage your GCash fee revenue with daily summaries and detailed records."
      />
      <GCashToolbar />
      <GCashEarningTable />
    </main>
  );
}
