import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
    title: "Gizlilik Politikası | Panobu",
    description: "Panobu gizlilik politikası - Kişisel verilerinizin nasıl korunduğunu öğrenin.",
};

export default function PrivacyPolicyPage() {
    return <PrivacyClient />;
}
