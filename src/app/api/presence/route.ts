import { NextResponse } from "next/server";
import {
  getRedis,
  PRESENCE_TTL_MS,
  PRESENCE_ZSET,
} from "@/lib/redis";

const SESSION_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

async function countLive(redis: NonNullable<ReturnType<typeof getRedis>>) {
  const now = Date.now();
  await redis.zremrangebyscore(PRESENCE_ZSET, 0, now);
  const live = await redis.zcard(PRESENCE_ZSET);
  return typeof live === "number" ? live : 0;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ live: null });
  }

  try {
    const live = await countLive(redis);
    return NextResponse.json({ live });
  } catch {
    return NextResponse.json({ live: null }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ live: null });
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      sessionId?: unknown;
    } | null;
    const sessionId = String(body?.sessionId ?? "").trim();

    if (!SESSION_ID_RE.test(sessionId)) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    const expiresAt = Date.now() + PRESENCE_TTL_MS;
    await redis.zadd(PRESENCE_ZSET, { score: expiresAt, member: sessionId });
    const live = await countLive(redis);
    return NextResponse.json({ live });
  } catch {
    return NextResponse.json({ live: null }, { status: 503 });
  }
}
