"use client";

import {
    AlertCircle,
    Check,
    CheckCircle2,
    Copy,
    Eye,
    Globe,
    ImagePlus,
    Loader2,
    MapPin,
    Moon,
    Phone,
    QrCode,
    Save,
    Store,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState, useTransition } from "react";
import { updateRestaurant } from "./actions";

interface Restaurant {
    id: string;
    name: string;
    description: string | null;
    phone: string | null;
    address: string | null;
    slug: string;
    theme: string | null;
    logo_url: string | null;
}

interface SettingsFormProps {
    restaurant: Restaurant;
}

export function SettingsForm({ restaurant }: SettingsFormProps) {
    const { setTheme } = useTheme();
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState(restaurant.name);
    const [description, setDescription] = useState(restaurant.description || "");
    const [phone, setPhone] = useState(restaurant.phone || "");
    const [address, setAddress] = useState(restaurant.address || "");
    const [selectedTheme, setSelectedTheme] = useState(restaurant.theme || "light");

    const completionItems = useMemo(
        () => [
            { label: "İşletme adı", complete: Boolean(name.trim()) },
            { label: "Kısa açıklama", complete: Boolean(description.trim()) },
            { label: "Telefon", complete: Boolean(phone.trim()) },
            { label: "Adres", complete: Boolean(address.trim()) },
        ],
        [address, description, name, phone]
    );

    const completionPercent = Math.round(
        (completionItems.filter((item) => item.complete).length / completionItems.length) * 100
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("phone", phone);
        formData.set("address", address);
        formData.set("theme", selectedTheme);

        startTransition(async () => {
            const result = await updateRestaurant(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTheme(selectedTheme);
                setTimeout(() => setSuccess(false), 3000);
            }
        });
    }

    async function handleCopyLink() {
        const menuPath = `/menu/${restaurant.slug}`;
        const menuUrl = typeof window === "undefined" ? menuPath : `${window.location.origin}${menuPath}`;
        try {
            await navigator.clipboard.writeText(menuUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch {
            setIsCopied(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 p-4 sm:p-6">
            {(error || success) && (
                <div
                    className={`rounded-2xl border p-4 text-sm font-semibold ${
                        error
                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        {error || "Değişiklikler başarıyla kaydedildi."}
                    </div>
                </div>
            )}

            <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                <Store className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">İşletme profili</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/45">
                                Bu bilgiler müşterinin menü sayfasında işletmenizi tanımasına yardımcı olur. Kısa, net ve güncel tutmanız yeterli.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Profil doluluğu</p>
                            <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">%{completionPercent}</p>
                            <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${completionPercent}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-500/15 dark:from-orange-500/10 dark:to-amber-500/5">
                    <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm dark:bg-white/10">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-950 dark:text-white">Menü adresiniz</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/55">
                                Slug kurulumdan sonra sabit tutulur; QR kodunuzun bozulmaması için değiştirilmez.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 rounded-2xl border border-orange-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                        <p className="break-all text-sm font-black text-slate-900 dark:text-white">/menu/{restaurant.slug}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <a
                            href={`/menu/${restaurant.slug}`}
                            target="_blank"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white"
                        >
                            <Eye className="h-4 w-4" />
                            Menüyü aç
                        </a>
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-orange-700"
                        >
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {isCopied ? "Kopyalandı" : "Linki kopyala"}
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_0.78fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-950 dark:text-white">Temel bilgiler</h3>
                            <p className="text-sm text-slate-500 dark:text-white/40">Menü sayfasında görünecek ana bilgiler.</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-white/70">İşletme adı</span>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isPending}
                                placeholder="Örn: Mavi Köşe Cafe"
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-white/70">Kısa açıklama</span>
                            <textarea
                                rows={4}
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isPending}
                                placeholder="Örn: Günlük taze tatlılar, özel kahveler ve sıcak yemekler."
                                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                            <span className="mt-2 block text-xs text-slate-500 dark:text-white/35">
                                Müşteriye işletmenizin tarzını bir iki cümleyle anlatın.
                            </span>
                        </label>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-white/70">Telefon</span>
                                <div className="relative mt-2">
                                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={isPending}
                                        placeholder="Örn: 0532 000 00 00"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                            </label>

                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-white/70">Adres</span>
                                <div className="relative mt-2">
                                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={isPending}
                                        placeholder="Mahalle, cadde, ilçe"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Kontrol listesi</h3>
                                <p className="text-sm text-slate-500 dark:text-white/40">Eksik kalan alanları buradan görün.</p>
                            </div>
                        </div>
                        <div className="mt-5 space-y-3">
                            {completionItems.map((item) => (
                                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                                    <CheckCircle2 className={`h-5 w-5 ${item.complete ? "text-emerald-500" : "text-slate-300 dark:text-white/25"}`} />
                                    <span className="text-sm font-bold text-slate-800 dark:text-white/80">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                <ImagePlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Logo ve görseller</h3>
                                <p className="text-sm text-slate-500 dark:text-white/40">Bu sürümde yükleme kapalı.</p>
                            </div>
                        </div>
                        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-white/[0.03] dark:text-white/45">
                            Logo ve kapak görseli alanı altyapıda var, ancak kullanıcı yüklemesi şu anda aktif değil. Ürün fotoğrafları ürün yönetimi ekranından takip edilir.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                            <QrCode className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-950 dark:text-white">Sabit menü URL</h3>
                            <p className="text-sm text-slate-500 dark:text-white/40">QR kodun bozulmaması için değiştirilemez.</p>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center">
                        <span className="rounded-l-2xl border border-r-0 border-slate-200 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-white/40">
                            /menu/
                        </span>
                        <input
                            type="text"
                            value={restaurant.slug}
                            disabled
                            className="min-w-0 flex-1 cursor-not-allowed rounded-r-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45"
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                            <Sun className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-950 dark:text-white">Panel görünümü</h3>
                            <p className="text-sm text-slate-500 dark:text-white/40">Bu seçim yönetim panelinin açık veya koyu görünümünü belirler.</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        {[
                            { value: "light", label: "Açık tema", text: "Gündüz kullanım için ferah görünüm", icon: Sun },
                            { value: "dark", label: "Koyu tema", text: "Daha düşük ışıklı ortamlar için", icon: Moon },
                        ].map((theme) => (
                            <button
                                key={theme.value}
                                type="button"
                                onClick={() => setSelectedTheme(theme.value)}
                                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                                    selectedTheme === theme.value
                                        ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03]"
                                }`}
                            >
                                {selectedTheme === theme.value && (
                                    <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-white">
                                        <Check className="h-3.5 w-3.5" />
                                    </span>
                                )}
                                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${theme.value === "light" ? "bg-white text-amber-500" : "bg-slate-950 text-slate-200"}`}>
                                    <theme.icon className="h-6 w-6" />
                                </div>
                                <p className="mt-4 text-sm font-black text-slate-950 dark:text-white">{theme.label}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">{theme.text}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0a0d]/85 sm:-mx-6 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500 dark:text-white/40">
                        Değişiklikler kaydedildiğinde dashboard ve menü sayfası güncellenir.
                    </p>
                    <button
                        type="submit"
                        disabled={isPending || !name.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-black text-white shadow-xl shadow-orange-500/20 transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isPending ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
                    </button>
                </div>
            </div>
        </form>
    );
}
