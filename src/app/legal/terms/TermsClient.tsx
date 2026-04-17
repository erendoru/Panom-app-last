"use client";

import PublicLayout from "@/components/PublicLayout";
import LegalBody from "@/components/legal/LegalBody";
import { useAppLocale } from "@/contexts/LocaleContext";
import { termsSections, termsTitle, termsUpdated } from "@/messages/legal/termsDoc";

export default function TermsClient() {
    const { locale } = useAppLocale();

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{termsTitle[locale]}</h1>
                <p className="text-neutral-500 mb-8">{termsUpdated[locale]}</p>
                <LegalBody sections={termsSections} />
            </div>
        </PublicLayout>
    );
}
