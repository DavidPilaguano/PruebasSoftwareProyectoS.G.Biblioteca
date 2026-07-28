import { NextRequest, NextResponse } from "next/server";

const BACKEND_ORIGIN = "https://backend-gray-one-13.vercel.app";
const ENCODED_BOM_PREFIX = "/%EF%BB%BFhttps://backend-gray-one-13.vercel.app";
const ENCODED_BOM_NORMALIZED_PREFIX =
  "/%EF%BB%BFhttps:/backend-gray-one-13.vercel.app";
const BOM_PREFIX = "/\uFEFFhttps://backend-gray-one-13.vercel.app";
const BOM_NORMALIZED_PREFIX = "/\uFEFFhttps:/backend-gray-one-13.vercel.app";
const HTTPS_PREFIX = "/https://backend-gray-one-13.vercel.app";
const HTTPS_NORMALIZED_PREFIX = "/https:/backend-gray-one-13.vercel.app";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const prefix = [
    ENCODED_BOM_PREFIX,
    ENCODED_BOM_NORMALIZED_PREFIX,
    BOM_PREFIX,
    BOM_NORMALIZED_PREFIX,
    HTTPS_PREFIX,
    HTTPS_NORMALIZED_PREFIX,
  ].find((item) => pathname.startsWith(item));

  if (!prefix) {
    return NextResponse.next();
  }

  const backendPath = pathname.slice(prefix.length) || "/";
  return NextResponse.redirect(`${BACKEND_ORIGIN}${backendPath}${search}`, 307);
}
