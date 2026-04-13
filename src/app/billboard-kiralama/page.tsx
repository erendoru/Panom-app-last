import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { TURKEY_CITIES } from "@/lib/turkey-data";
import { cityToSlug } from "@/lib/city-slug";

export const metadata: Metadata = {
    title: "Billboard Kiralama — 81 İl | Açık Hava Reklam - Panobu",
    description:
        "Türkiye'nin 81 ilinde billboard ve açık hava reklam alanı kiralama. İl seçin, şeffaf fiyatlarla panoları inceleyin.",
    alternates: {
        canonical: "https://panobu.com/billboard-kiralama",
    },
};

export default function BillboardKiralamaIndexPage() {
    return (
        <PublicLayout>
            <section className="pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            İl İl <span className="text-blue-400">Billboard Kiralama</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Açık hava reklam alanları için ilinizi seçin. Her il için billboard, CLP, raket pano ve dijital ekran rehberi.
                        </p>
                        <Link
                            href="/static-billboards"
                            className="inline-flex items-center gap-2 mt-6 text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Tüm panoları haritada gör <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {TURKEY_CITIES.map((city) => {
                            const slug = cityToSlug(city);
                            return (
                                <Link
                                    key={city}
                                    href={`/billboard-kiralama/${slug}`}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-900 transition-colors"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                    <span className="truncate">{city}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
