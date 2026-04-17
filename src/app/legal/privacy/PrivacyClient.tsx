"use client";

import PublicLayout from "@/components/PublicLayout";
import LegalBody from "@/components/legal/LegalBody";
import { useAppLocale } from "@/contexts/LocaleContext";
import { privacySections, privacyTitle, privacyUpdated } from "@/messages/legal/privacyDoc";

export default function PrivacyClient() {
    const { locale } = useAppLocale();

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">{privacyTitle[locale]}</h1>
                <p className="text-neutral-500 mb-8">{privacyUpdated[locale]}</p>
                <LegalBody sections={privacySections} />
            </div>
        </PublicLayout>
    );
}
