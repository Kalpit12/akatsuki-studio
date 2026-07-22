import { NextResponse } from "next/server";
import { getRedis, VISITS_TOTAL_KEY } from "@/lib/redis";

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|redditbot|ahrefs|semrush|bytespider|gptbot|claudebot|google-extended/i;

function isBot(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  return !ua || BOT_UA.test(ua);
}

async function readTotal(redis: NonNullable<ReturnType<typeof getRedis>>) {
  const total = await redis.get<number>(VISITS_TOTAL_KEY);
  return typeof total === "number" ? total : Number(total ?? 0) || 0;
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ total: null });
  }

  try {
    const total = await readTotal(redis);
    return NextResponse.json({ total });
  } catch {
    return NextResponse.json({ total: null }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ total: null });
  }

  try {
    if (isBot(request)) {
      const total = await readTotal(redis);
      return NextResponse.json({ total, counted: false });
    }

    const total = await redis.incr(VISITS_TOTAL_KEY);
    const dayKey = `visits:day:${new Date().toISOString().slice(0, 10)}`;
    await redis.incr(dayKey);

    return NextResponse.json({
      total: typeof total === "number" ? total : Number(total) || 0,
      counted: true,
    });
  } catch {
    return NextResponse.json({ total: null }, { status: 503 });
  }
}
