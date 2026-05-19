import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Custom middleware logic can go here if needed. 
    // withAuth automatically handles the session check based on the callbacks.
  },
  {
    callbacks: {
      // Security: Only allow access if the JWT token exists
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth", // Redirect unauthorized users to /auth
    },
  }
);

// Protect the dashboard route
export const config = {
  // Matches /dashboard and any child paths like /dashboard/settings
  matcher: ["/dashboard/:path*"],
};