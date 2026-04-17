import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
    title: "Hizmet Şartları | Panobu",
    description: "Panobu kullanım şartları ve koşulları.",
};

export default function TermsOfServicePage() {
    return <TermsClient />;
}
