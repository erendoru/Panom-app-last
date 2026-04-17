import type { Metadata } from "next";
import DistanceSalesClient from "./DistanceSalesClient";

export const metadata: Metadata = {
    title: "Mesafeli Satış Sözleşmesi | Panobu",
    description: "Panobu mesafeli satış sözleşmesi - Uzaktan yapılan satışlarda geçerli koşullar.",
};

export default function DistanceSalesPage() {
    return <DistanceSalesClient />;
}
