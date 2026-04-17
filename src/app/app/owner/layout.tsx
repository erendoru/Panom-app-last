import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getOwnerProfile } from "@/lib/owner/profile";
import OwnerShell from "./OwnerShell";

export const dynamic = "force-dynamic";

export default async function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?redirect=/app/owner/dashboard");
    }

    if (session.role !== "SCREEN_OWNER" && session.role !== "ADMIN") {
        if (session.role === "ADVERTISER") {
            redirect("/app/advertiser/dashboard");
        }
        redirect("/");
    }

    const profile = await getOwnerProfile();

    if (!profile) {
        // Rol doğru ama profil senkron edilmemiş — hesap sayfasına yönlendir.
        redirect("/app/owner/settings");
    }

    return <OwnerShell profile={profile}>{children}</OwnerShell>;
}
