// Convex auth configuration for Clerk
// See: https://docs.convex.dev/auth/clerk

const authConfig = {
  providers: [
    {
      domain: "https://clerk.stratagenie.com.au",
      applicationID: "convex",
    },
  ],
};

export default authConfig;
