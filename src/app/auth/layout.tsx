export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
