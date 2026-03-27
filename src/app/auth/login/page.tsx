import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = 'force-dynamic';

function LoadingFallback() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="h-8 bg-white/10 rounded w-32 mx-auto animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded w-48 mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-4">
                <div className="h-10 bg-white/5 rounded animate-pulse"></div>
                <div className="h-10 bg-white/5 rounded animate-pulse"></div>
                <div className="h-10 bg-white/10 rounded animate-pulse"></div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}
