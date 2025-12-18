import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const dynamic = 'force-dynamic';

function LoadingFallback() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="h-8 bg-slate-200 rounded w-32 mx-auto animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-48 mx-auto animate-pulse"></div>
            </div>
            <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
            <div className="space-y-4">
                <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <RegisterForm />
        </Suspense>
    );
}
