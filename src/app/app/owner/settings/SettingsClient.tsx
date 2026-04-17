"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Bell,
    ShieldAlert,
    Save,
    Loader2,
    CheckCircle2,
    Landmark,
    Mail,
    Phone,
    Globe,
    User as UserIcon,
    Trash2,
    Lock,
    AlertTriangle,
    Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CityMultiSelect from "@/components/form/CityMultiSelect";

type TabKey = "company" | "notifications" | "security";

type CompanyData = {
    companyName: string;
    taxId: string;
    address: string;
    phone: string;
    contactEmail: string;
    contactName: string;
    cities: string[];
    website: string;
    description: string;
    iban: string;
    bankName: string;
    bankAccountHolder: string;
    userEmail: string;
};

type NotifyPrefs = {
    notifyNewRequest: boolean;
    notifyCampaignStart: boolean;
    notifyProofReminder: boolean;
    notifyWeeklyDigest: boolean;
};

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "company", label: "Firma Bilgileri", icon: Building2 },
    { key: "notifications", label: "Bildirim Tercihleri", icon: Bell },
    { key: "security", label: "Hesap Güvenliği", icon: ShieldAlert },
];

export default function SettingsClient() {
    const router = useRouter();
    const [tab, setTab] = useState<TabKey>("company");

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-blue-600" />
                    Ayarlar
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Firma profilinizi, bildirim tercihlerinizi ve hesap güvenliğinizi yönetin.
                </p>
            </div>

            <div className="grid lg:grid-cols-[220px_1fr] gap-6">
                <nav className="lg:border-r lg:border-slate-200 lg:pr-4 lg:sticky lg:top-20 self-start">
                    <div className="inline-flex lg:flex lg:flex-col gap-1 w-full overflow-x-auto">
                        {TABS.map((t) => {
                            const Icon = t.icon;
                            const active = tab === t.key;
                            return (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition whitespace-nowrap ${
                                        active
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="min-w-0">
                    {tab === "company" && <CompanyTab />}
                    {tab === "notifications" && <NotificationsTab />}
                    {tab === "security" && <SecurityTab onLoggedOut={() => router.push("/auth/login")} />}
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  COMPANY TAB                                                               */
/* -------------------------------------------------------------------------- */

function CompanyTab() {
    const [data, setData] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/owner/settings/company", { cache: "no-store" });
                if (!res.ok) return;
                const d = await res.json();
                setData({
                    companyName: d.companyName ?? "",
                    taxId: d.taxId ?? "",
                    address: d.address ?? "",
                    phone: d.phone ?? "",
                    contactEmail: d.contactEmail ?? "",
                    contactName: d.user?.name ?? "",
                    cities: d.cities ?? [],
                    website: d.website ?? "",
                    description: d.description ?? "",
                    iban: d.iban ?? "",
                    bankName: d.bankName ?? "",
                    bankAccountHolder: d.bankAccountHolder ?? "",
                    userEmail: d.user?.email ?? "",
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function save() {
        if (!data) return;
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/owner/settings/company", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const body = await res.json().catch(() => ({}));
            if (res.ok) {
                setMessage({ type: "ok", text: "Değişiklikler kaydedildi." });
            } else {
                setMessage({ type: "err", text: body?.error ?? "Kaydedilemedi." });
            }
        } catch {
            setMessage({ type: "err", text: "Bağlantı hatası." });
        } finally {
            setSaving(false);
        }
    }

    if (loading || !data) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-3xl">
            {/* Kimlik / iletişim */}
            <Section title="Firma Kimliği" description="Faturalar ve resmi yazışmalar için kullanılan bilgiler.">
                <Field label="Firma adı *" icon={<Building2 className="w-4 h-4" />}>
                    <Input
                        value={data.companyName}
                        onChange={(e) => setData({ ...data, companyName: e.target.value })}
                        placeholder="Örn: Donanım Medya A.Ş."
                        required
                    />
                </Field>
                <Field label="Yetkili Ad Soyad" icon={<UserIcon className="w-4 h-4" />}>
                    <Input
                        value={data.contactName}
                        onChange={(e) => setData({ ...data, contactName: e.target.value })}
                        placeholder="Yetkili kişi"
                    />
                </Field>
                <Field label="Vergi No">
                    <Input
                        value={data.taxId}
                        onChange={(e) => setData({ ...data, taxId: e.target.value })}
                        placeholder="11 haneli TC veya 10 haneli VKN"
                    />
                </Field>
                <Field label="Adres">
                    <textarea
                        value={data.address}
                        onChange={(e) => setData({ ...data, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Firma adresi"
                    />
                </Field>
            </Section>

            <Section title="İletişim" description="Müşterilere ve Panobu'ya iletişim için kullanılır.">
                <Field label="İletişim e-posta" icon={<Mail className="w-4 h-4" />}>
                    <Input
                        type="email"
                        value={data.contactEmail}
                        onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                        placeholder="iletisim@firmaniz.com"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        Hesap e-postası: <span className="font-medium text-slate-600">{data.userEmail}</span>
                    </p>
                </Field>
                <Field label="Telefon" icon={<Phone className="w-4 h-4" />}>
                    <Input
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        placeholder="+90 555 555 55 55"
                    />
                </Field>
                <Field label="Web sitesi" icon={<Globe className="w-4 h-4" />}>
                    <Input
                        value={data.website}
                        onChange={(e) => setData({ ...data, website: e.target.value })}
                        placeholder="https://firmaniz.com"
                    />
                </Field>
            </Section>

            <Section
                title="Hizmet Verilen İller"
                description="Filtrelerde ve mağaza sayfanızda kullanılır."
            >
                <CityMultiSelect
                    value={data.cities}
                    onChange={(v) => setData({ ...data, cities: v })}
                />
            </Section>

            <Section
                title="Firma Açıklaması"
                description="Mağaza (public) sayfanızın başında gösterilir."
            >
                <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    rows={4}
                    maxLength={2000}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Hizmet verdiğiniz bölgeler, pano tipleri, avantajlarınız..."
                />
                <div className="text-xs text-slate-400 text-right mt-1">
                    {data.description.length} / 2000
                </div>
            </Section>

            <Section
                title="Banka Bilgileri"
                description="Ödeme (payout) için kullanılır. Panobu ekibi harici kimseyle paylaşılmaz."
                accent="emerald"
            >
                <Field label="IBAN" icon={<Landmark className="w-4 h-4" />}>
                    <Input
                        value={data.iban}
                        onChange={(e) =>
                            setData({ ...data, iban: e.target.value.toUpperCase() })
                        }
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        maxLength={34}
                    />
                </Field>
                <Field label="Banka Adı">
                    <Input
                        value={data.bankName}
                        onChange={(e) => setData({ ...data, bankName: e.target.value })}
                        placeholder="Örn: Garanti BBVA"
                    />
                </Field>
                <Field label="Hesap Sahibi">
                    <Input
                        value={data.bankAccountHolder}
                        onChange={(e) => setData({ ...data, bankAccountHolder: e.target.value })}
                        placeholder="Hesabın kayıtlı olduğu kişi/firma adı"
                    />
                </Field>
            </Section>

            {message && (
                <div
                    className={`p-3 rounded-lg text-sm font-medium border ${
                        message.type === "ok"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-rose-50 border-rose-200 text-rose-700"
                    }`}
                >
                    {message.type === "ok" ? (
                        <CheckCircle2 className="w-4 h-4 inline mr-1.5 align-text-top" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 inline mr-1.5 align-text-top" />
                    )}
                    {message.text}
                </div>
            )}

            <div className="flex justify-end pt-2">
                <Button
                    onClick={save}
                    disabled={saving || !data.companyName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Kaydet
                </Button>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  NOTIFICATIONS TAB                                                         */
/* -------------------------------------------------------------------------- */

function NotificationsTab() {
    const [prefs, setPrefs] = useState<NotifyPrefs | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/owner/settings/notifications", { cache: "no-store" });
                if (res.ok) setPrefs(await res.json());
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function toggle(key: keyof NotifyPrefs) {
        if (!prefs) return;
        const next = { ...prefs, [key]: !prefs[key] };
        setPrefs(next);
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/owner/settings/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [key]: next[key] }),
            });
            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading || !prefs) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    const items: {
        key: keyof NotifyPrefs;
        title: string;
        desc: string;
    }[] = [
        {
            key: "notifyNewRequest",
            title: "Yeni kiralama talebi",
            desc: "Panolarınız için yeni bir kiralama talebi geldiğinde e-posta gönderilir.",
        },
        {
            key: "notifyCampaignStart",
            title: "Kampanya başlangıç hatırlatması",
            desc: "Onayladığınız bir kampanyanın yayın tarihi geldiğinde size hatırlatma yapılır.",
        },
        {
            key: "notifyProofReminder",
            title: "Yayın kanıtı hatırlatması",
            desc: "Aktif kampanyalar için yayın kanıtı yüklemediğinizde haftalık hatırlatma gönderilir.",
        },
        {
            key: "notifyWeeklyDigest",
            title: "Haftalık özet raporu",
            desc: "Her Pazartesi panolarınızın doluluk, gelir ve talep özeti e-posta ile gelir.",
        },
    ];

    return (
        <div className="max-w-2xl space-y-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-2 divide-y divide-slate-100">
                {items.map((it) => (
                    <div key={it.key} className="flex items-start justify-between gap-4 p-3">
                        <div className="min-w-0">
                            <div className="font-medium text-slate-900">{it.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{it.desc}</div>
                        </div>
                        <Switch
                            checked={prefs[it.key]}
                            disabled={saving}
                            onChange={() => toggle(it.key)}
                        />
                    </div>
                ))}
            </div>
            {saved && (
                <div className="text-xs text-emerald-700 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tercih kaydedildi
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  SECURITY TAB                                                              */
/* -------------------------------------------------------------------------- */

function SecurityTab({ onLoggedOut }: { onLoggedOut: () => void }) {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMessage, setPwMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const [delOpen, setDelOpen] = useState(false);
    const [delReason, setDelReason] = useState("");
    const [delSaving, setDelSaving] = useState(false);
    const [delMessage, setDelMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    async function changePassword() {
        setPwMessage(null);
        if (next.length < 8) {
            setPwMessage({ type: "err", text: "Yeni şifre en az 8 karakter olmalı." });
            return;
        }
        if (next !== confirm) {
            setPwMessage({ type: "err", text: "Yeni şifre iki alanda aynı olmalı." });
            return;
        }
        setPwSaving(true);
        try {
            const res = await fetch("/api/owner/account/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: current, newPassword: next }),
            });
            const body = await res.json().catch(() => ({}));
            if (res.ok) {
                setPwMessage({ type: "ok", text: "Şifreniz başarıyla değiştirildi." });
                setCurrent("");
                setNext("");
                setConfirm("");
            } else {
                setPwMessage({ type: "err", text: body?.error ?? "Şifre değiştirilemedi." });
            }
        } catch {
            setPwMessage({ type: "err", text: "Bağlantı hatası." });
        } finally {
            setPwSaving(false);
        }
    }

    async function requestDeletion() {
        setDelSaving(true);
        setDelMessage(null);
        try {
            const res = await fetch("/api/owner/account/delete-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: delReason }),
            });
            if (res.ok) {
                setDelMessage({
                    type: "ok",
                    text: "Talebiniz alındı. Panobu ekibi 3 iş günü içinde size dönüş yapacak.",
                });
                setDelOpen(false);
            } else {
                const body = await res.json().catch(() => ({}));
                setDelMessage({ type: "err", text: body?.error ?? "İşlem başarısız." });
            }
        } catch {
            setDelMessage({ type: "err", text: "Bağlantı hatası." });
        } finally {
            setDelSaving(false);
        }
    }

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        onLoggedOut();
    }

    return (
        <div className="max-w-2xl space-y-4">
            {/* Password */}
            <Section
                title="Şifre Değiştir"
                description="En az 8 karakter, farklı ve tahmin edilemeyen bir şifre belirleyin."
            >
                <Field label="Mevcut şifre" icon={<Lock className="w-4 h-4" />}>
                    <Input
                        type="password"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                </Field>
                <Field label="Yeni şifre" icon={<Lock className="w-4 h-4" />}>
                    <Input
                        type="password"
                        value={next}
                        onChange={(e) => setNext(e.target.value)}
                        placeholder="En az 8 karakter"
                        autoComplete="new-password"
                    />
                </Field>
                <Field label="Yeni şifre (tekrar)" icon={<Lock className="w-4 h-4" />}>
                    <Input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Yeni şifreyi tekrar girin"
                        autoComplete="new-password"
                    />
                </Field>
                {pwMessage && (
                    <div
                        className={`p-3 rounded-lg text-sm font-medium border ${
                            pwMessage.type === "ok"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}
                    >
                        {pwMessage.text}
                    </div>
                )}
                <div className="flex justify-end pt-1">
                    <Button
                        onClick={changePassword}
                        disabled={pwSaving || !current || !next || !confirm}
                        className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                        {pwSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Lock className="w-4 h-4 mr-2" />
                        )}
                        Şifreyi güncelle
                    </Button>
                </div>
            </Section>

            {/* Session */}
            <Section
                title="Oturum"
                description="Diğer cihazlardan çıkış yapmak için çıkış yapıp tekrar giriş yapabilirsiniz."
            >
                <Button
                    variant="outline"
                    onClick={logout}
                    className="text-slate-700"
                >
                    Çıkış Yap
                </Button>
            </Section>

            {/* Dangerous */}
            <Section
                title="Hesabı Sil"
                description="Hesabınızın silinmesi için Panobu ekibine talep iletilir."
                accent="rose"
            >
                {delMessage && (
                    <div
                        className={`p-3 rounded-lg text-sm font-medium border mb-3 ${
                            delMessage.type === "ok"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-rose-50 border-rose-200 text-rose-700"
                        }`}
                    >
                        {delMessage.text}
                    </div>
                )}

                {!delOpen ? (
                    <Button
                        variant="outline"
                        onClick={() => setDelOpen(true)}
                        className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hesap silme talebinde bulun
                    </Button>
                ) : (
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-sm text-rose-800">
                            <AlertTriangle className="w-4 h-4 inline mr-1.5 align-text-top" />
                            <strong>Uyarı:</strong> Aktif kampanyalarınız tamamlanmadan hesap silinemez.
                            Bu işlem panolarınızı ve geçmiş raporlarınızı kaldırır, geri alınamaz.
                        </div>
                        <Label className="text-xs font-medium text-slate-600">
                            Silme sebebi (opsiyonel)
                        </Label>
                        <textarea
                            value={delReason}
                            onChange={(e) => setDelReason(e.target.value)}
                            rows={3}
                            maxLength={1000}
                            placeholder="Panobu ekibinin size yardımcı olabileceği konu varsa yazabilirsiniz..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={requestDeletion}
                                disabled={delSaving}
                                className="bg-rose-600 hover:bg-rose-700 text-white"
                            >
                                {delSaving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Silme talebini gönder
                            </Button>
                            <button
                                onClick={() => setDelOpen(false)}
                                className="text-sm text-slate-500 hover:text-slate-700"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                )}
            </Section>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Presentational helpers                                                    */
/* -------------------------------------------------------------------------- */

function Section({
    title,
    description,
    accent,
    children,
}: {
    title: string;
    description?: string;
    accent?: "emerald" | "rose";
    children: React.ReactNode;
}) {
    const border =
        accent === "emerald"
            ? "border-emerald-200"
            : accent === "rose"
                ? "border-rose-200"
                : "border-slate-200";
    return (
        <section className={`bg-white border ${border} rounded-2xl p-5`}>
            <div className="mb-3">
                <h2 className="font-semibold text-slate-900">{title}</h2>
                {description && (
                    <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                )}
            </div>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

function Field({
    label,
    icon,
    children,
}: {
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                {icon}
                {label}
            </Label>
            {children}
        </div>
    );
}

function Switch({
    checked,
    disabled,
    onChange,
}: {
    checked: boolean;
    disabled?: boolean;
    onChange: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            role="switch"
            aria-checked={checked}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:opacity-60 ${
                checked ? "bg-slate-900" : "bg-slate-200"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}
