// app/api/current-user/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/auth/services/auth";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic"; // keep it dynamic; you're doing manual cache
export const revalidate = 0;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const user = result.data.user;
    const cacheKey = `current-user:${user.id}`;

    // try cache
    const cached = await redis.get<typeof result.data>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { success: true, message: result.message, data: cached },
        { status: 200 },
      );
    }

    // cache miss: store fresh
    await redis.set(cacheKey, result.data, { ex: 60 }); // TTL 60s (adjust)
    return NextResponse.json(
      { success: true, message: result.message, data: result.data },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
