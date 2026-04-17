"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { AppLocale } from "@/messages/publicNav";
import { persistLocale, readStoredLocale } from "@/messages/publicNav";

type LocaleContextValue = {
    locale: AppLocale;
    setLocale: (next: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<AppLocale>("tr");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = readStoredLocale();
        if (stored) setLocaleState(stored);
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        persistLocale(locale);
        document.documentElement.lang = locale === "en" ? "en" : "tr";
    }, [locale, ready]);

    const setLocale = useCallback((next: AppLocale) => {
        setLocaleState(next);
    }, []);

    const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useAppLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error("useAppLocale must be used within LocaleProvider");
    }
    return ctx;
}
