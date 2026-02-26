import AppHeader from "@/components/app-header";
import GCashToolbar from "@/features/gcash/components/gcash-toolbar";

export default function GCashPage() {
  return (
    <div>
      <AppHeader
        title="GCash Earnings"
        description="Monitor and manage your GCash fee revenue with daily summaries and detailed records."
      />
      <GCashToolbar />
    </div>
  );
}
