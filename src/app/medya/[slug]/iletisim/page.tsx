import { notFound } from "next/navigation";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { loadStoreOwner } from "@/lib/store/loader";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "İletişim" };

export default async function ContactPage(
    { params }: { params: { slug: string } }
) {
    const owner = await loadStoreOwner(params.slug);
    if (!owner) notFound();

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">İletişim</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {owner.companyName} ekibine doğrudan ulaşın veya kısa bir not bırakın.
                </p>
            </div>

            <div className="grid md:grid-cols-[1fr_340px] gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">
                    <h2 className="font-semibold text-slate-900 mb-4">Bize Ulaşın</h2>
                    <ContactForm />
                </div>

                <aside className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h3 className="font-semibold text-slate-900 mb-3">İletişim Kanalları</h3>
                        <ul className="space-y-2.5 text-sm">
                            {owner.website && (
                                <li className="flex items-center gap-2 text-slate-700">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <a
                                        href={owner.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-slate-900 truncate"
                                    >
                                        {owner.website.replace(/^https?:\/\//, "")}
                                    </a>
                                </li>
                            )}
                            {owner.contactEmail && (
                                <li className="flex items-center gap-2 text-slate-700">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <a
                                        href={`mailto:${owner.contactEmail}`}
                                        className="hover:text-slate-900"
                                    >
                                        {owner.contactEmail}
                                    </a>
                                </li>
                            )}
                            {owner.phone && (
                                <li className="flex items-center gap-2 text-slate-700">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    <a href={`tel:${owner.phone}`} className="hover:text-slate-900">
                                        {owner.phone}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {owner.cities.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                Hizmet Bölgeleri
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {owner.cities.map((c) => (
                                    <span
                                        key={c}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-50 border border-slate-200 text-slate-600"
                                    >
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
