"use client";

import { useGetGCashEarning } from "@/features/gcash/hooks/use-gcash-earning";

export default function GCashEarningData() {
  const {
    gcashEarnings,
    isGetGCashEarningPending,
    isGetGCashEarningError,
    getGCashEarningError,
  } = useGetGCashEarning();

  if (isGetGCashEarningPending) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">GCash Earning Data</h1>
        <p className="text-gray-500">Loading GCash earnings...</p>
      </div>
    );
  }

  if (isGetGCashEarningError) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">GCash Earning Data</h1>
        <p className="text-red-500">
          Error:{" "}
          {getGCashEarningError?.message || "Failed to load GCash earnings"}
        </p>
      </div>
    );
  }

  if (!gcashEarnings || gcashEarnings.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">GCash Earning Data</h1>
        <p className="text-gray-500">No GCash earnings found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Date
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {gcashEarnings.map((earning) => (
              <tr key={earning.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(earning.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {earning.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
