import ContentPageLayout from "@/components/site/ContentPageLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
    return (
        <ContentPageLayout
            title="Kariyer"
            subtitle="Geleceği birlikte inşa edelim."
        >
            <p>
                Panobu ekibi olarak, reklamcılık teknolojilerini yeniden tanımlıyoruz.
                Yaratıcı, tutkulu ve yenilikçi takım arkadaşları arıyoruz.
            </p>

            <h3>Açık Pozisyonlar</h3>
            <div className="space-y-4 my-8">
                <div className="border p-4 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">Frontend Developer</h4>
                            <p className="text-sm text-slate-500">İstanbul (Hibrit) • Tam Zamanlı</p>
                        </div>
                        <Button variant="outline" size="sm">Başvur</Button>
                    </div>
                </div>
                <div className="border p-4 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">Sales Manager</h4>
                            <p className="text-sm text-slate-500">İstanbul • Tam Zamanlı</p>
                        </div>
                        <Button variant="outline" size="sm">Başvur</Button>
                    </div>
                </div>
            </div>

            <p>
                Aradığınız pozisyonu listede göremediniz mi? Genel başvurularınız için CV'nizi
                <a href="mailto:kariyer@panobu.com" className="text-blue-600 hover:underline ml-1">kariyer@panobu.com</a> adresine gönderebilirsiniz.
            </p>
        </ContentPageLayout>
    );
}
