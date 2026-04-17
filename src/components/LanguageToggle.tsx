"use client";

import { useAppLocale } from "@/contexts/LocaleContext";
import type { AppLocale } from "@/messages/publicNav";

type Props = {
    className?: string;
};

export default function LanguageToggle({ className = "" }: Props) {
    const { locale, setLocale } = useAppLocale();

    const segment = (code: AppLocale, label: string) => {
        const active = locale === code;
        return (
            <button
                type="button"
                onClick={() => setLocale(code)}
                className={`min-w-[2.5rem] px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full transition-all duration-200 ${
                    active
                        ? "bg-[#11b981] text-white shadow-md shadow-[#11b981]/25"
                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/80"
                }`}
                aria-pressed={active}
                aria-label={code === "tr" ? "Türkçe" : "English"}
            >
                {label}
            </button>
        );
    };

    return (
        <div
            className={`inline-flex items-center gap-0.5 rounded-full border border-neutral-200/90 bg-neutral-50/95 p-0.5 shadow-sm backdrop-blur-sm ${className}`}
            role="group"
            aria-label="Dil seçimi"
        >
            {segment("tr", "TR")}
            {segment("en", "EN")}
        </div>
    );
}
