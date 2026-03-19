"use client";

import AppHeader from "@/components/layout/app-header";

export default function AccountPage() {
  return (
    <main className="flex flex-col gap-4">
      <AppHeader
        title="Account"
        description="View and manage your account settings, profile information, and store details."
      />
      <div className="space-y-4">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">API Responses Test</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">
                /api/auth/get-user (Supabase)
              </h3>
              <ApiTestButton endpoint="/api/auth/get-user" />
            </div>

            <div>
              <h3 className="font-medium mb-2">/api/user (Prisma)</h3>
              <ApiTestButton endpoint="/api/user" />
            </div>

            <div>
              <h3 className="font-medium mb-2">/api/store (Prisma)</h3>
              <ApiTestButton endpoint="/api/store" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ApiTestButton({ endpoint }: { endpoint: string }) {
  const handleTest = async () => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log(`${endpoint}:`, data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      alert(`Error: ${error}`);
    }
  };

  return (
    <button
      onClick={handleTest}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
    >
      Test {endpoint}
    </button>
  );
}
