import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/check-strata-hub-access(.*)",
  // SEO files
  "/sitemap.xml",
  "/robots.txt",
  // Marketing/SEO pages
  "/blog(.*)",
  "/privacy",
  "/terms",
  "/tools(.*)",
  "/guides(.*)",
  "/strata-management(.*)",
  // Google verification
  "/google(.*).html",
  // Preview page for UI testing
  "/preview(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|pdf|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
