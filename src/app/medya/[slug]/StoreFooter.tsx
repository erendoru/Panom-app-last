"use client";

import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { useStore } from "./StoreContext";

export default function StoreFooter() {
    const { owner } = useStore();

    return (
        <footer className="mt-16 border-t border-slate-200 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid md:grid-cols-3 gap-8">
                <div>
                    <div className="font-semibold text-slate-900 mb-2">{owner.companyName}</div>
                    {owner.description && (
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                            {owner.description}
                        </p>
                    )}
                </div>

                <div>
                    <div className="font-semibold text-slate-900 mb-2">İletişim</div>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                        {owner.website && (
                            <li className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <a
                                    href={owner.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-slate-900"
                                >
                                    {owner.website.replace(/^https?:\/\//, "")}
                                </a>
                            </li>
                        )}
                        {owner.contactEmail && (
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <a href={`mailto:${owner.contactEmail}`} className="hover:text-slate-900">
                                    {owner.contactEmail}
                                </a>
                            </li>
                        )}
                        {owner.phone && (
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <a href={`tel:${owner.phone}`} className="hover:text-slate-900">
                                    {owner.phone}
                                </a>
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <div className="font-semibold text-slate-900 mb-2">Hizmet Bölgeleri</div>
                    {owner.cities.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {owner.cities.map((c) => (
                                <span
                                    key={c}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white border border-slate-200 text-slate-600"
                                >
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {c}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">Türkiye geneli hizmet</p>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div>© {new Date().getFullYear()} {owner.companyName}. Tüm hakları saklıdır.</div>
                    <div>
                        Powered by{" "}
                        <Link href="https://panobu.com" target="_blank" className="font-medium text-slate-700 hover:text-slate-900">
                            Panobu
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
