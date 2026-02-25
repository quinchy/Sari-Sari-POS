import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FullLogo } from "@/components/app-logo";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-dvh gap-5 bg-slant">
      <FullLogo />
      <Card className="p-10 rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-4xl font-black text-secondary">
            404
          </CardTitle>
          <CardDescription className="text-2xl font-bold text-secondary">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="mx-auto">
          <Button>
            <Link href="/" className="flex items-center gap-2">
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
