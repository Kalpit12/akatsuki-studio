import { NextResponse } from "next/server";

const FORMSPREE_URL =
  process.env.FORMSPREE_URL ?? "https://formspree.io/f/xkodrjdd";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const company = String(body.company ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formspreeRes = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        message,
        _replyto: email,
        _subject: `New project inquiry from ${name}`,
      }),
    });

    const payload = (await formspreeRes.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      errors?: Array<{ message: string }>;
    } | null;

    if (!formspreeRes.ok) {
      const detail =
        payload?.error ??
        payload?.errors?.map((entry) => entry.message).join(", ") ??
        "Form submission failed";
      return NextResponse.json({ error: detail }, { status: formspreeRes.status });
    }

    return NextResponse.json({ success: true, ok: payload?.ok ?? true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
