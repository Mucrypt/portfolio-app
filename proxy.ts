import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ingest (server-to-server, bearer-token auth; no cookies or sessions)
     * - api/webhooks (provider webhooks: signature-verified, no cookies or sessions)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/ingest/|api/webhooks/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
