"use client";

import { useMemo, useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { TURKEY_CITIES } from "@/lib/turkey-data";

type Props = {
    value: string[];
    onChange: (next: string[]) => void;
    maxHeight?: number;
    placeholder?: string;
    disabled?: boolean;
};

const SUGGESTIONS = ["İstanbul", "Ankara", "İzmir", "Kocaeli", "Sakarya", "Bursa", "Antalya"];

function normalize(text: string) {
    return text.toLocaleLowerCase("tr-TR");
}

export default function CityMultiSelect({
    value,
    onChange,
    maxHeight = 240,
    placeholder = "Şehir ara...",
    disabled,
}: Props) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = normalize(query.trim());
        if (!q) return TURKEY_CITIES;
        return TURKEY_CITIES.filter((c) => normalize(c).includes(q));
    }, [query]);

    const toggle = (city: string) => {
        if (disabled) return;
        if (value.includes(city)) {
            onChange(value.filter((c) => c !== city));
        } else {
            onChange([...value, city]);
        }
    };

    const clearAll = () => {
        if (disabled) return;
        onChange([]);
    };

    return (
        <div className="space-y-3">
            {/* Selected chips */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((city) => (
                        <span
                            key={city}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800"
                        >
                            {city}
                            <button
                                type="button"
                                onClick={() => toggle(city)}
                                aria-label={`${city} kaldır`}
                                className="hover:text-emerald-950"
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    {value.length > 1 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                        >
                            Tümünü temizle
                        </button>
                    )}
                </div>
            )}

            {/* Quick suggestions (only if nothing selected yet) */}
            {value.length === 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((city) => (
                        <button
                            key={city}
                            type="button"
                            onClick={() => toggle(city)}
                            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-emerald-300 hover:text-emerald-800"
                            disabled={disabled}
                        >
                            <Plus className="h-3 w-3" />
                            {city}
                        </button>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                    disabled={disabled}
                />
            </div>

            {/* Options */}
            <div
                className="rounded-md border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-y-auto"
                style={{ maxHeight }}
            >
                {filtered.length === 0 ? (
                    <p className="py-3 text-center text-xs text-neutral-500">Eşleşen şehir yok.</p>
                ) : (
                    filtered.map((city) => {
                        const selected = value.includes(city);
                        return (
                            <button
                                key={city}
                                type="button"
                                onClick={() => toggle(city)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                                    selected
                                        ? "bg-emerald-50 text-emerald-900"
                                        : "hover:bg-neutral-50 text-neutral-800"
                                }`}
                                disabled={disabled}
                            >
                                <span>{city}</span>
                                <span
                                    className={`h-4 w-4 rounded border flex items-center justify-center ${
                                        selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-neutral-300"
                                    }`}
                                    aria-hidden
                                >
                                    {selected && "✓"}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>

            <p className="text-xs text-neutral-500">{value.length} şehir seçili</p>
        </div>
    );
}
