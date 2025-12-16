import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ContentPageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function ContentPageLayout({ title, subtitle, children }: ContentPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b py-4 shadow-sm">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Ana Sayfa
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">Panobu</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h1>
                    {subtitle && <p className="text-xl text-slate-500 mb-8">{subtitle}</p>}

                    <div className="prose prose-slate max-w-none">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
