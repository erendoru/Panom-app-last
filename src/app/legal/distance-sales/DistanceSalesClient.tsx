"use client";

import PublicLayout from "@/components/PublicLayout";
import { useAppLocale } from "@/contexts/LocaleContext";
import { distanceCopy, distanceTitle, distanceUpdated } from "@/messages/legal/distanceDoc";

export default function DistanceSalesClient() {
    const { locale } = useAppLocale();
    const c = distanceCopy(locale);

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{distanceTitle[locale]}</h1>
                <p className="text-neutral-500 mb-8">{distanceUpdated[locale]}</p>

                <div className="prose prose prose-neutral prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m1h}</h2>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-4 not-prose">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{c.m1s1}</h3>
                                <p className="text-neutral-600 whitespace-pre-line">{c.m1seller}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{c.m1s2}</h3>
                                <p className="text-neutral-600">{c.m1buyer}</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m2h}</h2>
                        <p className="text-neutral-600">{c.m2p}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m3h}</h2>
                        <p className="text-neutral-600 mb-4">{c.m3p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                            {c.m3ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                        <p className="text-neutral-600 mt-4">{c.m3p2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m4h}</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{c.m41h}</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                    {c.m41ul.map((li) => (
                                        <li key={li}>{li}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-neutral-900 mb-2">{c.m42h}</h3>
                                <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                    {c.m42ul.map((li) => (
                                        <li key={li}>{li}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m5h}</h2>
                        <p className="text-neutral-600 mb-4">{c.m5p}</p>
                        <div className="bg-slate-800 p-6 rounded-lg space-y-3 not-prose">
                            {c.m5lines.map((row) => (
                                <p key={row.line} className={row.cls}>
                                    {row.line}
                                </p>
                            ))}
                        </div>
                        <p className="text-neutral-600 mt-4">{c.m5p2}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m6h}</h2>
                        <ul className="list-disc list-inside text-neutral-600 space-y-3">
                            {c.m6ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m7h}</h2>
                        <p className="text-neutral-600 mb-4">{c.m7p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                            {c.m7ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m8h}</h2>
                        <p className="text-neutral-600">{c.m8p}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.m9h}</h2>
                        <div className="bg-slate-800 p-6 rounded-lg not-prose">
                            <p className="text-neutral-900">
                                <strong>Email:</strong> destek@panobu.com
                            </p>
                            <p className="text-neutral-900 mt-2">
                                <strong>{locale === "en" ? "Phone" : "Telefon"}:</strong> +90 (262) 123 45 67
                            </p>
                            <p className="text-neutral-900 mt-2">
                                <strong>{locale === "en" ? "Address" : "Adres"}:</strong> Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
