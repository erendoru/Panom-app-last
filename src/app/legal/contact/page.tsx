import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "İletişim | Panobu",
    description: "Panobu iletişim bilgileri - Bize ulaşın.",
};

export default function ContactPage() {
    return <ContactClient />;
}
