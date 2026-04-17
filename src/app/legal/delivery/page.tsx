import type { Metadata } from "next";
import DeliveryClient from "./DeliveryClient";

export const metadata: Metadata = {
    title: "Teslimat Koşulları | Panobu",
    description: "Panobu dijital reklam teslimat ve yayın koşulları.",
};

export default function DeliveryPolicyPage() {
    return <DeliveryClient />;
}
