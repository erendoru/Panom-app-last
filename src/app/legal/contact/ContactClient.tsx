"use client";

import PublicLayout from "@/components/PublicLayout";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useAppLocale } from "@/contexts/LocaleContext";
import { contactCopy, contactTitle } from "@/messages/legal/contactDoc";

export default function ContactClient() {
    const { locale } = useAppLocale();
    const c = contactCopy(locale);
    const subject = locale === "en" ? "Support request" : "Destek Talebi";

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{contactTitle[locale]}</h1>
                <p className="text-neutral-500 mb-12">{c.lead}</p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-[#11b981] p-3 rounded-xl text-white">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{c.emailTitle}</h3>
                                <p className="text-neutral-500">{c.emailSub}</p>
                            </div>
                        </div>
                        <a href="mailto:destek@panobu.com" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
                            destek@panobu.com
                        </a>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-600 p-3 rounded-xl">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{c.phoneTitle}</h3>
                                <p className="text-neutral-500">{c.phoneSub}</p>
                            </div>
                        </div>
                        <a href="tel:+902621234567" className="text-green-400 hover:text-green-300 text-lg font-medium">
                            +90 (262) 123 45 67
                        </a>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-600 p-3 rounded-xl">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{c.addrTitle}</h3>
                                <p className="text-neutral-500">{c.addrSub}</p>
                            </div>
                        </div>
                        <p className="text-neutral-600">{c.addrLine}</p>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-orange-600 p-3 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{c.hoursTitle}</h3>
                                <p className="text-neutral-500">{c.hoursSub}</p>
                            </div>
                        </div>
                        <p className="text-neutral-600 whitespace-pre-line">{c.hoursBody}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-blue-500/30">
                    <h2 className="text-2xl font-bold mb-4">{c.quickTitle}</h2>
                    <p className="text-neutral-600 mb-6">{c.quickBody}</p>
                    <a
                        href={`mailto:destek@panobu.com?subject=${encodeURIComponent(subject)}`}
                        className="inline-block bg-[#11b981] hover:bg-[#0ea472] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                        {c.quickCta}
                    </a>
                </div>

                <div className="mt-12 prose prose prose-neutral max-w-none">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">{c.companyTitle}</h2>
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <p className="text-neutral-600 mb-2">
                            <strong>{c.cName}:</strong> {c.companyRows[0][0]}
                        </p>
                        <p className="text-neutral-600 mb-2">
                            <strong>{c.cTax}:</strong> {c.companyRows[1][0]}
                        </p>
                        <p className="text-neutral-600 mb-2">
                            <strong>{c.cNo}:</strong> {c.companyRows[2][0]}
                        </p>
                        <p className="text-neutral-600 mb-2">
                            <strong>{c.cAddr}:</strong> {c.companyRows[3][0]}
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
