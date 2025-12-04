import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up | StrataGenie",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-xl",
          },
        }}
        signInUrl="/sign-in"
      />
    </div>
  );
}
