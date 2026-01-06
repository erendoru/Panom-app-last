import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-blue-500/20">404</h1>
                </div>

                {/* Message */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Sayfa Bulunamadı
                    </h2>
                    <p className="text-slate-400">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        Aşağıdaki bağlantılardan devam edebilirsiniz.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" /> Ana Sayfa
                        </Link>
                    </Button>
                    <Button asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all">
                        <Link href="/static-billboards">
                            <MapPin className="w-4 h-4 mr-2" /> Panoları İncele
                        </Link>
                    </Button>
                </div>

                {/* Helpful Links */}
                <div className="border-t border-white/10 pt-6">
                    <p className="text-sm text-slate-500 mb-4">Popüler Sayfalar</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/how-it-works" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                            Nasıl Çalışır?
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/blog" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                            Blog
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/billboard-kiralama/kocaeli" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                            Kocaeli Panolar
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link href="/company/about" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                            Hakkımızda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
