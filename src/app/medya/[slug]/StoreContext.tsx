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
import { weeklyEquivalent } from "@/lib/utils";

export type StoreOwnerContext = {
    id: string;
    companyName: string;
    slug: string;
    logoUrl: string | null;
    description: string | null;
    website: string | null;
    phone: string | null;
    contactEmail: string | null;
    cities: string[];
};

export type SelectedPanel = {
    id: string;
    name: string;
    city: string;
    district: string;
    type: string;
    priceWeekly: number | null;
    priceMonthly?: number | null;
    price3Month?: number | null;
    price6Month?: number | null;
    priceYearly?: number | null;
    priceDaily?: number | null;
    printingFee?: number | string | null;
};

type Ctx = {
    owner: StoreOwnerContext;
    selected: SelectedPanel[];
    toggle: (p: SelectedPanel) => void;
    isSelected: (id: string) => boolean;
    remove: (id: string) => void;
    clear: () => void;
    totalWeekly: number;
};

const StoreCtx = createContext<Ctx | null>(null);

export function useStore(): Ctx {
    const ctx = useContext(StoreCtx);
    if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
    return ctx;
}

const storageKey = (slug: string) => `panobu:store:${slug}:selected`;

export function StoreProvider({
    owner,
    children,
}: {
    owner: StoreOwnerContext;
    children: ReactNode;
}) {
    const [selected, setSelected] = useState<SelectedPanel[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey(owner.slug));
            if (raw) {
                const parsed = JSON.parse(raw) as SelectedPanel[];
                if (Array.isArray(parsed)) setSelected(parsed);
            }
        } catch {
            /* ignore */
        }
    }, [owner.slug]);

    useEffect(() => {
        try {
            localStorage.setItem(storageKey(owner.slug), JSON.stringify(selected));
        } catch {
            /* ignore */
        }
    }, [selected, owner.slug]);

    const isSelected = useCallback(
        (id: string) => selected.some((s) => s.id === id),
        [selected]
    );

    const toggle = useCallback((p: SelectedPanel) => {
        setSelected((curr) =>
            curr.some((s) => s.id === p.id)
                ? curr.filter((s) => s.id !== p.id)
                : [...curr, p]
        );
    }, []);

    const remove = useCallback((id: string) => {
        setSelected((curr) => curr.filter((s) => s.id !== id));
    }, []);

    const clear = useCallback(() => setSelected([]), []);

    const totalWeekly = useMemo(
        () =>
            selected.reduce((sum, p) => {
                const w = weeklyEquivalent(p) ?? 0;
                return sum + w;
            }, 0),
        [selected]
    );

    const value: Ctx = useMemo(
        () => ({ owner, selected, toggle, isSelected, remove, clear, totalWeekly }),
        [owner, selected, toggle, isSelected, remove, clear, totalWeekly]
    );

    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
