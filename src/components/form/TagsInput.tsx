"use client";

import { useMemo, useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { NEARBY_TAG_GROUPS, ALL_NEARBY_TAGS, normalizeTag } from "@/lib/panel-tags";

interface Props {
    value: string[];
    onChange: (tags: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
    max?: number;
}

export default function TagsInput({
    value,
    onChange,
    disabled,
    placeholder = "Etiket ekle... (örn: Market, Otel, Tekel)",
    max = 30,
}: Props) {
    const [query, setQuery] = useState("");

    const selectedSet = useMemo(
        () => new Set(value.map((t) => t.toLocaleLowerCase("tr-TR"))),
        [value]
    );

    const filteredGroups = useMemo(() => {
        if (!query.trim()) return NEARBY_TAG_GROUPS;
        const q = query.toLocaleLowerCase("tr-TR");
        return NEARBY_TAG_GROUPS.map((g) => ({
            ...g,
            tags: g.tags.filter((t) => t.toLocaleLowerCase("tr-TR").includes(q)),
        })).filter((g) => g.tags.length > 0);
    }, [query]);

    const exactMatchExists = useMemo(() => {
        const q = normalizeTag(query);
        if (!q) return true;
        const qLow = q.toLocaleLowerCase("tr-TR");
        return (
            selectedSet.has(qLow) ||
            ALL_NEARBY_TAGS.some((t) => t.toLocaleLowerCase("tr-TR") === qLow)
        );
    }, [query, selectedSet]);

    function add(tag: string) {
        const clean = normalizeTag(tag);
        if (!clean) return;
        if (value.length >= max) return;
        if (selectedSet.has(clean.toLocaleLowerCase("tr-TR"))) return;
        onChange([...value, clean]);
    }

    function remove(tag: string) {
        onChange(value.filter((t) => t !== tag));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            if (query.trim()) {
                add(query);
                setQuery("");
            }
        } else if (e.key === "Backspace" && !query && value.length > 0) {
            remove(value[value.length - 1]);
        }
    }

    return (
        <div className="space-y-3">
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-xs"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => remove(tag)}
                                disabled={disabled}
                                className="hover:bg-blue-100 rounded-full p-0.5"
                                aria-label={`${tag} etiketini kaldır`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || value.length >= max}
                    className="w-full pl-9 pr-20 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {query.trim() && !exactMatchExists && (
                    <button
                        type="button"
                        onClick={() => {
                            add(query);
                            setQuery("");
                        }}
                        disabled={disabled}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                    >
                        <Plus className="w-3 h-3" />
                        Ekle
                    </button>
                )}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                {filteredGroups.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">
                        Öneri bulunamadı — Enter&apos;a basarak kendi etiketinizi ekleyebilirsiniz.
                    </p>
                ) : (
                    filteredGroups.map((g) => (
                        <div key={g.title}>
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                {g.title}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {g.tags.map((tag) => {
                                    const selected = selectedSet.has(tag.toLocaleLowerCase("tr-TR"));
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => (selected ? remove(tag) : add(tag))}
                                            disabled={disabled || (!selected && value.length >= max)}
                                            className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
                                                selected
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-700"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <p className="text-xs text-slate-500">
                {value.length}/{max} etiket seçildi. Önerilerden seçebilir veya kendi etiketinizi
                yazıp Enter&apos;a basabilirsiniz.
            </p>
        </div>
    );
}
