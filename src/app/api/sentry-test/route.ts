import { NextResponse } from 'next/server';

export async function GET() {
  throw new Error("Sentry Integration Test Error - Next.js App Router");
  return NextResponse.json({ success: false });
}
