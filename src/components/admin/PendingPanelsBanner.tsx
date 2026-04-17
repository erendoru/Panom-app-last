"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hourglass, ArrowRight } from "lucide-react";

export default function PendingPanelsBanner() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/panels?reviewStatus=PENDING")
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => {
                if (cancelled) return;
                if (Array.isArray(data)) {
                    setCount(data.filter((p: any) => p.reviewStatus === "PENDING").length);
                }
            })
            .catch(() => {
                /* ignore */
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!count) return null;

    return (
        <Link
            href="/app/admin/panels/pending"
            className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-6 hover:bg-amber-100 transition-colors"
        >
            <span className="inline-flex items-center gap-2">
                <Hourglass className="w-4 h-4" />
                <strong>{count} pano</strong> medya sahibi tarafından gönderildi, admin onayı bekliyor.
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
                İncele
                <ArrowRight className="w-4 h-4" />
            </span>
        </Link>
    );
}
