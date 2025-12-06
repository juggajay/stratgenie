import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8">
        <span className="text-3xl font-display font-medium tracking-tight">
          <span className="text-[#1a1a2e]">Strata</span>
          <span className="text-[#FF6B35]">Genie</span>
        </span>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-[20px] border border-[#E8E4DE]",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
