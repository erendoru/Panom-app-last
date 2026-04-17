import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

type Props = {
    title: string;
    description: string;
    phase: string;
    features: string[];
    icon: React.ComponentType<{ className?: string }>;
    cta?: { href: string; label: string };
};

export default function OwnerPagePlaceholder({ title, description, phase, features, icon: Icon, cta }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{title}</h1>
                <p className="text-slate-500 mt-1">{description}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" /> {phase}
                        </div>
                        <h2 className="text-lg font-semibold mt-2">Bu modül çok yakında yayında.</h2>
                        <p className="text-sm text-white/80 mt-1 max-w-2xl">
                            Ekip olarak aşağıdaki özellikler üzerinde çalışıyoruz. Ana sayfadan ünitelerinizin mevcut durumunu
                            takip etmeye ve ünite eklemeye devam edebilirsiniz.
                        </p>
                    </div>
                    {cta && (
                        <Link href={cta.href}>
                            <Button variant="secondary" className="bg-white text-blue-700 hover:bg-slate-100">
                                {cta.label}
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-slate-900 mb-3">Yakında gelecek özellikler</p>
                <ul className="space-y-2">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
