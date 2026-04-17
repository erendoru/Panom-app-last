import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import AdvertiserRentalDetailClient from "./AdvertiserRentalDetailClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pano Kiralama | Panobu" };

export default async function AdvertiserRentalDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getSession();
    if (!session || !session.userId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-500">Giriş yapmanız gerekiyor.</p>
            </div>
        );
    }

    const advertiser = await prisma.advertiser.findUnique({
        where: { userId: session.userId },
        select: { id: true },
    });
    if (!advertiser) return notFound();

    const rental = await prisma.staticRental.findFirst({
        where: { id: params.id, advertiserId: advertiser.id },
        select: { id: true },
    });
    if (!rental) return notFound();

    return <AdvertiserRentalDetailClient id={rental.id} />;
}
