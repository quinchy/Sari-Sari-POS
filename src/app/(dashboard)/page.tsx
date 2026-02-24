"use client";

import { useSignOut } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <div>
      <p>Dashboard</p>

      <Button onClick={() => signOut()} disabled={isSigningOut}>
        {isSigningOut ? (
          <>
            <Spinner />
            Signing Out
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    </div>
  );
}
