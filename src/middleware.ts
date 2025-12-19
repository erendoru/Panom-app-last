import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const { pathname } = req.nextUrl;

    // Public paths
    const publicPaths = ["/", "/auth/login", "/auth/register", "/screens", "/static-billboards"];
    if (publicPaths.some(path => pathname === path || pathname.startsWith(path + "/") || pathname.startsWith("/api/auth"))) {
        return res;
    }

    // Protected routes
    if (!session) {
        if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    }

    // Note: Role-based redirection is complex in middleware with Supabase because user metadata 
    // might not be fully synced or requires a DB call which is not ideal in middleware.
    // We will handle role checks in the page layouts or server components for now.

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, favicon.png (favicon files)
         * - images folder
         * - api/auth routes (handled separately)
         * - public folder assets
         */
        "/((?!_next/static|_next/image|favicon.ico|favicon.png|images|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
