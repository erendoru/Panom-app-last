import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function OwnerSettingsPage() {
    // Faz 10'da çok tab'lı "Firma Ayarları" gelene kadar mevcut hesap sayfasına yönlendiriyoruz.
    redirect("/app/owner/account");
}
