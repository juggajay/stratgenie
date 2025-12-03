import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-xl",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
