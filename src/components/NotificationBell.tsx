"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Loader2, Inbox, Clock } from "lucide-react";

type Notif = {
    id: string;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    meta: Record<string, unknown> | null;
    readAt: string | null;
    createdAt: string;
};

function timeAgo(iso: string): string {
    const then = new Date(iso).getTime();
    const diff = Date.now() - then;
    const m = Math.floor(diff / 60000);
    if (m < 1) return "az önce";
    if (m < 60) return `${m}dk`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}sa`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}g`;
    const w = Math.floor(d / 7);
    if (w < 4) return `${w}hf`;
    const mo = Math.floor(d / 30);
    return `${mo}ay`;
}

const TYPE_COLORS: Record<string, string> = {
    REQUEST_NEW: "bg-amber-100 text-amber-700",
    REQUEST_APPROVED: "bg-emerald-100 text-emerald-700",
    REQUEST_REJECTED: "bg-rose-100 text-rose-700",
    CREATIVE_SUBMITTED: "bg-indigo-100 text-indigo-700",
    CREATIVE_APPROVED: "bg-emerald-100 text-emerald-700",
    CREATIVE_REJECTED: "bg-rose-100 text-rose-700",
    PROOF_UPLOADED: "bg-sky-100 text-sky-700",
    PROOF_CONFIRMED: "bg-emerald-100 text-emerald-700",
    PROOF_REMINDER: "bg-amber-100 text-amber-700",
    INQUIRY_NEW: "bg-blue-100 text-blue-700",
    OWNER_APPROVED: "bg-emerald-100 text-emerald-700",
    ACCOUNT_DELETION_REQUESTED: "bg-rose-100 text-rose-700",
    ADMIN_MESSAGE: "bg-slate-100 text-slate-700",
    CAMPAIGN_START: "bg-violet-100 text-violet-700",
    GENERIC: "bg-slate-100 text-slate-700",
};

export default function NotificationBell({
    className = "",
    align = "right",
}: {
    className?: string;
    align?: "left" | "right";
}) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Notif[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    async function refresh(silent = true) {
        if (!silent) setLoading(true);
        try {
            const res = await fetch("/api/notifications?limit=30", { cache: "no-store" });
            if (res.ok) {
                const d = await res.json();
                setItems(Array.isArray(d?.items) ? d.items : []);
                setUnread(Number(d?.unreadCount ?? 0));
            }
        } catch {
            /* ignore */
        } finally {
            if (!silent) setLoading(false);
        }
    }

    useEffect(() => {
        refresh(false);
        const id = setInterval(() => refresh(true), 45_000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        function onEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        if (open) {
            document.addEventListener("mousedown", onClickOutside);
            document.addEventListener("keydown", onEsc);
        }
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    async function markAllRead() {
        await fetch("/api/notifications", { method: "PATCH" });
        setItems((arr) => arr.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
        setUnread(0);
    }

    async function markOne(id: string) {
        await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        setItems((arr) =>
            arr.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)),
        );
        setUnread((n) => Math.max(0, n - 1));
    }

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Bildirimler"
                className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-semibold flex items-center justify-center">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={`absolute z-50 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl ${
                        align === "right" ? "right-0" : "left-0"
                    }`}
                    role="menu"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Bildirimler</div>
                            {unread > 0 && (
                                <div className="text-[11px] text-slate-500">{unread} okunmamış</div>
                            )}
                        </div>
                        {items.length > 0 && unread > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Tümünü okundu işaretle
                            </button>
                        )}
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                        {loading && (
                            <div className="flex justify-center py-8 text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        )}
                        {!loading && items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Inbox className="w-6 h-6 mb-2" />
                                <div className="text-xs">Henüz bildiriminiz yok</div>
                            </div>
                        )}

                        {!loading &&
                            items.map((n) => {
                                const unreadItem = !n.readAt;
                                const typeChip = TYPE_COLORS[n.type] ?? TYPE_COLORS.GENERIC;
                                const content = (
                                    <div
                                        className={`flex gap-3 px-4 py-3 border-b border-slate-50 last:border-b-0 transition ${
                                            unreadItem ? "bg-blue-50/40" : "bg-white"
                                        } hover:bg-slate-50`}
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeChip}`}
                                        >
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium text-slate-900 truncate">
                                                    {n.title}
                                                </div>
                                                {unreadItem && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                                )}
                                            </div>
                                            {n.body && (
                                                <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                                    {n.body}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                {timeAgo(n.createdAt)}
                                                {unreadItem && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            markOne(n.id);
                                                        }}
                                                        className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Okundu
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                                if (n.link) {
                                    return (
                                        <Link
                                            key={n.id}
                                            href={n.link}
                                            onClick={() => {
                                                if (unreadItem) markOne(n.id);
                                                setOpen(false);
                                            }}
                                        >
                                            {content}
                                        </Link>
                                    );
                                }
                                return <div key={n.id}>{content}</div>;
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
