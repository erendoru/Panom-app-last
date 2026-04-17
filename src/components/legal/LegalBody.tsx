"use client";

import { useAppLocale } from "@/contexts/LocaleContext";
import type { AppLocale } from "@/messages/publicNav";

export type LegalSection =
    | {
          kind: "section";
          h2: Record<AppLocale, string>;
          paragraphs?: Record<AppLocale, string[]>;
          list?: Record<AppLocale, string[]>;
          orderedList?: Record<AppLocale, string[]>;
          /** Rendered after ul/ol */
          afterListParagraphs?: Record<AppLocale, string[]>;
      }
    | {
          kind: "contact";
          h2: Record<AppLocale, string>;
          intro: Record<AppLocale, string>;
          emailLabel: Record<AppLocale, string>;
          addressLabel: Record<AppLocale, string>;
          addressLine: Record<AppLocale, string>;
      };

export default function LegalBody({ sections }: { sections: LegalSection[] }) {
    const { locale } = useAppLocale();

    return (
        <div className="prose prose prose-neutral prose-lg max-w-none space-y-8">
            {sections.map((block, i) => {
                if (block.kind === "contact") {
                    return (
                        <section key={i}>
                            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{block.h2[locale]}</h2>
                            <p className="text-neutral-600">{block.intro[locale]}</p>
                            <div className="bg-slate-800 p-6 rounded-lg mt-4 not-prose">
                                <p className="text-neutral-900">
                                    <strong>{block.emailLabel[locale]}</strong> destek@panobu.com
                                </p>
                                <p className="text-neutral-900 mt-2">
                                    <strong>{block.addressLabel[locale]}</strong> {block.addressLine[locale]}
                                </p>
                            </div>
                        </section>
                    );
                }

                return (
                    <section key={i}>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-4">{block.h2[locale]}</h2>
                        {block.paragraphs?.[locale]?.map((p, j) => (
                            <p key={j} className="text-neutral-600">
                                {p}
                            </p>
                        ))}
                        {block.list?.[locale] && (
                            <ul className="list-disc list-inside text-neutral-600 space-y-2 mt-4">
                                {block.list[locale]!.map((li, k) => (
                                    <li key={k}>{li}</li>
                                ))}
                            </ul>
                        )}
                        {block.orderedList?.[locale] && (
                            <ol className="list-decimal list-inside text-neutral-600 space-y-3 mt-4">
                                {block.orderedList[locale]!.map((li, k) => (
                                    <li key={k}>{li}</li>
                                ))}
                            </ol>
                        )}
                        {block.afterListParagraphs?.[locale]?.map((p, j) => (
                            <p key={`a-${j}`} className="text-neutral-600 mt-4">
                                {p}
                            </p>
                        ))}
                    </section>
                );
            })}
        </div>
    );
}
