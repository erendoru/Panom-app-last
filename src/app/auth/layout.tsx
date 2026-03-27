import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
            <div className="w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                        Panobu
                    </Link>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/[0.08]">
                    {children}
                </div>
            </div>
        </div>
    );
}
