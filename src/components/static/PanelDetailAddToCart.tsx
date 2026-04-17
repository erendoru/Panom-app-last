"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import { useAppLocale } from "@/contexts/LocaleContext";
import { staticBillboardsCopy } from "@/messages/staticBillboards";

function getSessionId(): string {
    if (typeof window === "undefined") return "";
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
}

export default function PanelDetailAddToCart({ panelId }: { panelId: string }) {
    const { locale } = useAppLocale();
    const s = staticBillboardsCopy(locale);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        if (!panelId) return;
        setError(null);
        setLoading(true);
        try {
            const sessionId = getSessionId();
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-session-id": sessionId },
                body: JSON.stringify({ panelId, sessionId }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || s.genericError);
            } else {
                setAdded(true);
                setTimeout(() => setAdded(false), 3000);
            }
        } catch {
            setError(s.connectionError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                type="button"
                onClick={handleClick}
                disabled={loading || added}
                className={`h-12 w-full text-sm font-semibold ${
                    added
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-[#11b981] text-white hover:bg-[#0ea271]"
                }`}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : added ? (
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> {s.addedToCart}
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" /> {s.addToCart}
                    </span>
                )}
            </Button>
            {error && <p className="mt-1.5 text-center text-xs text-red-500">{error}</p>}
            <p className="mt-1.5 text-center text-[11px] leading-tight text-slate-400">{s.cartHint}</p>
        </div>
    );
}
