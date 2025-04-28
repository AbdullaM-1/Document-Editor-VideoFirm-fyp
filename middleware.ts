import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJWT } from "./app/lib/auth"

export async function middleware(request: NextRequest) {
  // Skip middleware in development for now to debug issues
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // Check if the user is authenticated
  const isAuthenticated = token && (await verifyJWT(token))

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register"]
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path),
  )

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // Redirect to login if trying to access protected route without authentication
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthenticated && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    // Redirect to editor if trying to access login/register while authenticated
    return NextResponse.redirect(new URL("/editor", request.url))
  }

  return NextResponse.next()
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
