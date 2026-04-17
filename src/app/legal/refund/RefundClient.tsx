"use client";

import PublicLayout from "@/components/PublicLayout";
import { useAppLocale } from "@/contexts/LocaleContext";
import { refundCopy, refundTiers, refundTitle, refundUpdated } from "@/messages/legal/refundDoc";

const tierTitleClass: Record<string, string> = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    red: "text-red-400",
};

export default function RefundClient() {
    const { locale } = useAppLocale();
    const c = refundCopy(locale);
    const tiers = refundTiers(locale);

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{refundTitle[locale]}</h1>
                <p className="text-neutral-500 mb-8">{refundUpdated[locale]}</p>

                <div className="prose prose prose-neutral prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s1h}</h2>
                        <p className="text-neutral-600">{c.s1p}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s2h}</h2>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-4 not-prose">
                            {tiers.map((tier, idx) => (
                                <div key={tier.key} className={idx < tiers.length - 1 ? "border-b border-slate-700 pb-4" : ""}>
                                    <h3 className={`text-lg font-bold ${tierTitleClass[tier.color]}`}>{tier.title}</h3>
                                    <p className="text-neutral-600 mt-2">{tier.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s3h}</h2>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                            {c.s3ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s4h}</h2>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                            {c.s4ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s5h}</h2>
                        <p className="text-neutral-600">{c.s5p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2 mt-4">
                            {c.s5ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s6h}</h2>
                        <ol className="list-decimal list-inside text-neutral-600 space-y-3">
                            {c.s6ol.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s7h}</h2>
                        <p className="text-neutral-600">{c.s7p}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s8h}</h2>
                        <p className="text-neutral-600 mb-4">{c.s8p}</p>
                        <div className="bg-slate-800 p-6 rounded-lg not-prose">
                            <p className="text-neutral-900">
                                <strong>E-posta / Email:</strong> destek@panobu.com
                            </p>
                            <p className="text-neutral-900 mt-2">
                                <strong>{locale === "en" ? "Subject" : "Konu"}:</strong> {c.subjectLine}
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
