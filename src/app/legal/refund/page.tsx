import type { Metadata } from "next";
import RefundClient from "./RefundClient";

export const metadata: Metadata = {
    title: "İade Politikası | Panobu",
    description: "Panobu para iade koşulları ve iptal politikası.",
};

export default function RefundPolicyPage() {
    return <RefundClient />;
}
