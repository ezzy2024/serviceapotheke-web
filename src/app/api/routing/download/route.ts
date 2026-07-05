import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userAgent = req.headers.get("user-agent") || "";
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);

  const appStoreUrl = "https://apps.apple.com/app/serviceapotheke/id123456789";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.serviceapotheke.app";
  const fallbackUrl = "https://serviceapotheke.de/download";

  if (isIOS) {
    return NextResponse.redirect(appStoreUrl, 302);
  }

  if (isAndroid) {
    return NextResponse.redirect(playStoreUrl, 302);
  }

  return NextResponse.redirect(fallbackUrl, 302);
}
