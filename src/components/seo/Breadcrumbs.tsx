"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import Script from "next/script";

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    // Full breadcrumb list with home
    const fullItems = [
        { name: "Ana Sayfa", href: "/" },
        ...items
    ];

    // BreadcrumbList schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": fullItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://panobu.com${item.href}`
        }))
    };

    return (
        <>
            <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
                {fullItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                        {index === fullItems.length - 1 ? (
                            <span className="text-slate-400">{item.name}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                            >
                                {index === 0 && <Home className="w-3 h-3" />}
                                {item.name}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
