import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { loadStoreOwner } from "@/lib/store/loader";
import StoreShell from "./StoreShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { slug: string };

export async function generateMetadata(
    { params }: { params: Params }
): Promise<Metadata> {
    const owner = await loadStoreOwner(params.slug);
    if (!owner) return { title: "Mağaza bulunamadı" };
    const title = owner.companyName;
    const description =
        (owner.description && owner.description.slice(0, 180)) ||
        `${owner.companyName} — billboard ve açık hava reklam üniteleri.`;
    const ogImage = owner.coverUrl || owner.logoUrl || undefined;
    return {
        title: { default: title, template: `%s | ${title}` },
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://panobu.com/medya/${owner.slug}`,
            images: ogImage ? [{ url: ogImage }] : undefined,
            siteName: title,
        },
        twitter: {
            card: ogImage ? "summary_large_image" : "summary",
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
        alternates: {
            canonical: `https://panobu.com/medya/${owner.slug}`,
        },
        icons: owner.logoUrl ? { icon: owner.logoUrl } : undefined,
    };
}

export default async function MediaOwnerLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Params;
}) {
    const owner = await loadStoreOwner(params.slug);
    if (!owner) notFound();

    return (
        <StoreShell
            owner={{
                id: owner.id,
                companyName: owner.companyName,
                slug: owner.slug,
                logoUrl: owner.logoUrl,
                description: owner.description,
                website: owner.website,
                phone: owner.phone,
                contactEmail: owner.contactEmail,
                cities: owner.cities,
            }}
        >
            {children}
        </StoreShell>
    );
}
