import InquiryForm from "./InquiryForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teklif Al" };

export default function InquiryPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Teklif Al</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Seçtiğiniz üniteler için bilgilerinizi bırakın — ekibimiz en kısa sürede dönüş yapsın.
                </p>
            </div>
            <InquiryForm />
        </div>
    );
}
