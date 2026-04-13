import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-neutral-900 tracking-tight">
                        Panobu
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-neutral-200">
                    {children}
                </div>
            </div>
        </div>
    );
}
