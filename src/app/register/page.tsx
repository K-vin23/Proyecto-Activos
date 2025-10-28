import RegisterForm from "@/components/auth/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <Suspense>
                <RegisterForm />
              </Suspense>
            </div>
        </div>
    )
}
