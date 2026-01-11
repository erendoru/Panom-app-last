import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "İletişim | Panobu",
    description: "Panobu iletişim bilgileri - Bize ulaşın.",
};

export default function ContactPage() {
    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">İletişim</h1>
                <p className="text-slate-400 mb-12">
                    Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçin.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-blue-600 p-3 rounded-xl">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">E-posta</h3>
                                <p className="text-slate-400">7/24 yanıt</p>
                            </div>
                        </div>
                        <a href="mailto:destek@panobu.com" className="text-blue-400 hover:text-blue-300 text-lg font-medium">
                            destek@panobu.com
                        </a>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-green-600 p-3 rounded-xl">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Telefon</h3>
                                <p className="text-slate-400">Hafta içi 09:00 - 18:00</p>
                            </div>
                        </div>
                        <a href="tel:+902621234567" className="text-green-400 hover:text-green-300 text-lg font-medium">
                            +90 (262) 123 45 67
                        </a>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-purple-600 p-3 rounded-xl">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Adres</h3>
                                <p className="text-slate-400">Merkez ofis</p>
                            </div>
                        </div>
                        <p className="text-slate-300">
                            Kocaeli, Türkiye
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-orange-600 p-3 rounded-xl">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Çalışma Saatleri</h3>
                                <p className="text-slate-400">Müşteri hizmetleri</p>
                            </div>
                        </div>
                        <p className="text-slate-300">
                            Pazartesi - Cuma: 09:00 - 18:00<br />
                            Cumartesi: 10:00 - 14:00
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 rounded-2xl border border-blue-500/30">
                    <h2 className="text-2xl font-bold mb-4">Hızlı Destek</h2>
                    <p className="text-slate-300 mb-6">
                        Sipariş, ödeme veya teknik konularda acil destek için e-posta gönderin.
                        24 saat içinde yanıt garantisi veriyoruz.
                    </p>
                    <a
                        href="mailto:destek@panobu.com?subject=Destek Talebi"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                        Destek Talebi Gönder
                    </a>
                </div>

                <div className="mt-12 prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-white mb-4">Şirket Bilgileri</h2>
                    <div className="bg-slate-800 p-6 rounded-lg">
                        <p className="text-slate-300 mb-2"><strong>Şirket Adı:</strong> Pufero Mobilya Ticaret Limited Şirketi</p>
                        <p className="text-slate-300 mb-2"><strong>Vergi Dairesi:</strong> Körfez Vergi Dairesi</p>
                        <p className="text-slate-300 mb-2"><strong>Vergi No:</strong> 7331202819</p>
                        <p className="text-slate-300 mb-2"><strong>Adres:</strong> Esentepe Mah. İplik Sk. No: 23 İç Kapı No: 1 Körfez/Kocaeli</p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
