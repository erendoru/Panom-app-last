"use client";

import PublicLayout from "@/components/PublicLayout";
import { useAppLocale } from "@/contexts/LocaleContext";
import { deliveryCopy, deliveryTitle, deliveryUpdated } from "@/messages/legal/deliveryDoc";

export default function DeliveryClient() {
    const { locale } = useAppLocale();
    const c = deliveryCopy(locale);

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{deliveryTitle[locale]}</h1>
                <p className="text-neutral-500 mb-8">{deliveryUpdated[locale]}</p>

                <div className="prose prose prose-neutral prose-lg max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s1h}</h2>
                        <p className="text-neutral-600">{c.s1p}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s2h}</h2>
                        <ol className="list-decimal list-inside text-neutral-600 space-y-3">
                            {c.s2ol.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s3h}</h2>
                        <div className="bg-slate-800 p-6 rounded-lg not-prose">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4">{c.s3h3}</h3>
                            <ul className="list-disc list-inside text-neutral-600 space-y-2">
                                {c.s3ul.map((li) => (
                                    <li key={li}>{li}</li>
                                ))}
                            </ul>
                        </div>
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
                        <p className="text-neutral-600 mb-4">{c.s5p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2">
                            {c.s5ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s6h}</h2>
                        <p className="text-neutral-600">{c.s6p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2 mt-4">
                            {c.s6ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s7h}</h2>
                        <p className="text-neutral-600">{c.s7p}</p>
                        <ul className="list-disc list-inside text-neutral-600 space-y-2 mt-4">
                            {c.s7ul.map((li) => (
                                <li key={li}>{li}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.s8h}</h2>
                        <p className="text-neutral-600 mb-4">{c.s8p}</p>
                        <div className="bg-slate-800 p-6 rounded-lg not-prose">
                            <p className="text-neutral-900">
                                <strong>Email:</strong> destek@panobu.com
                            </p>
                            <p className="text-neutral-900 mt-2">
                                <strong>{locale === "en" ? "Phone" : "Telefon"}:</strong> +90 (262) 123 45 67
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
