"use client";

import ContentPageLayout from "@/components/site/ContentPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <ContentPageLayout
            title="İletişim"
            subtitle="Sorularınız mı var? Bize ulaşın."
        >
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <p className="text-lg text-neutral-600">
                        Projeniz, reklam ihtiyaçlarınız veya partnerlik fırsatları için bizimle iletişime geçmekten çekinmeyin.
                        Ekibimiz en kısa sürede size dönüş yapacaktır.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 mb-1">Adres</h3>
                                <p className="text-neutral-600">
                                    Bilişim Vadisi, Muallimköy Mah. Deniz Cad. No:143/5<br />
                                    Gebze, Kocaeli
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 mb-1">E-posta</h3>
                                <p className="text-neutral-600">
                                    info@panobu.com.tr
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 mb-1">Telefon</h3>
                                <p className="text-neutral-600">
                                    +90 850 123 45 67
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-neutral-700">Ad Soyad</Label>
                                <Input id="name" placeholder="John Doe" className="bg-white border-neutral-200 text-neutral-900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-neutral-700">E-posta</Label>
                                <Input id="email" type="email" placeholder="john@example.com" className="bg-white border-neutral-200 text-neutral-900" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-neutral-700">Konu</Label>
                            <Input id="subject" placeholder="Bilgi Talebi" className="bg-white border-neutral-200 text-neutral-900" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-neutral-700">Mesajınız</Label>
                            <Textarea id="message" placeholder="Size nasıl yardımcı olabiliriz?" className="min-h-[120px] bg-white border-neutral-200 text-neutral-900" />
                        </div>

                        <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-6">
                            Gönder
                        </Button>
                    </form>
                </div>
            </div>
        </ContentPageLayout>
    );
}
