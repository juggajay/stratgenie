// Convex auth configuration for Clerk
// See: https://docs.convex.dev/auth/clerk

const authConfig = {
  providers: [
    {
      domain: "https://logical-gecko-21.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

export default authConfig;
