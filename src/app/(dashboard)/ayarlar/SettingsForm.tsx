"use client";

import { Save, Globe, Palette, Store, Upload, Link, Sun, Moon, Check, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useTransition } from "react";
import { updateRestaurant } from "./actions";

interface Restaurant {
    id: string;
    name: string;
    description: string | null;
    phone: string | null;
    slug: string;
    theme: string | null;
    logo_url: string | null;
}

interface SettingsFormProps {
    restaurant: Restaurant;
}

export function SettingsForm({ restaurant }: SettingsFormProps) {
    const { theme: systemTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state with real data
    const [name, setName] = useState(restaurant.name);
    const [description, setDescription] = useState(restaurant.description || "");
    const [phone, setPhone] = useState(restaurant.phone || "");
    const [selectedTheme, setSelectedTheme] = useState(restaurant.theme || "light");

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        formData.set('phone', phone);
        formData.set('theme', selectedTheme);

        startTransition(async () => {
            const result = await updateRestaurant(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                // Apply theme change to dashboard
                setTheme(selectedTheme);
                setTimeout(() => setSuccess(false), 3000);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
            {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-[13px]">
                    Değişiklikler başarıyla kaydedildi!
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Restaurant Info */}
                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Restoran Bilgileri</h3>
                            <p className="text-[12px] text-slate-500 dark:text-white/40">Temel bilgilerinizi düzenleyin</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[12px] font-medium text-slate-600 dark:text-white/50 mb-2">
                                Restoran Adı
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-slate-600 dark:text-white/50 mb-2">
                                Açıklama
                            </label>
                            <textarea
                                rows={3}
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all resize-none disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-[12px] font-medium text-slate-600 dark:text-white/50 mb-2">
                                Telefon
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Logo Upload */}
                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Logo & Görsel</h3>
                            <p className="text-[12px] text-slate-500 dark:text-white/40">Bu sürümde görsel yükleme kapalı</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
                        <p className="text-[13px] text-slate-700 dark:text-white/70">
                            Restoran logosu ve ürün görselleri yönetici tarafından sabit tutuluyor.
                        </p>
                        <p className="text-[12px] text-slate-500 dark:text-white/40 mt-1">
                            Kullanıcı yükleme özelliği geçici olarak devre dışı bırakıldı.
                        </p>
                    </div>
                </div>

                {/* URL Settings */}
                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Menü URL</h3>
                            <p className="text-[12px] text-slate-500 dark:text-white/40">Benzersiz menü adresiniz</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[12px] font-medium text-slate-600 dark:text-white/50 mb-2">
                                URL Slug <span className="text-slate-400 dark:text-white/30">(değiştirilemez)</span>
                            </label>
                            <div className="flex items-center">
                                <span className="px-4 py-2.5 rounded-l-xl bg-slate-100 dark:bg-white/10 border border-r-0 border-slate-200 dark:border-white/10 text-[13px] text-slate-500 dark:text-white/40">
                                    qrmenuly.com/
                                </span>
                                <input
                                    type="text"
                                    value={restaurant.slug}
                                    disabled
                                    className="flex-1 px-4 py-2.5 rounded-r-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/50 text-[13px] cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border border-orange-200 dark:border-orange-500/20">
                            <Link className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                            <div>
                                <p className="text-[12px] text-orange-700 dark:text-white/70">Menünüz yayında:</p>
                                <a
                                    href={`/menu/${restaurant.slug}`}
                                    target="_blank"
                                    className="text-[13px] font-medium text-orange-600 dark:text-orange-400 hover:underline"
                                >
                                    qrmenuly.com/{restaurant.slug}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Settings */}
                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">Panel Teması</h3>
                            <p className="text-[12px] text-slate-500 dark:text-white/40">Dashboard görünümü</p>
                        </div>
                    </div>

                    {mounted && (
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedTheme("light")}
                                className={`relative p-4 rounded-xl border-2 transition-all ${selectedTheme === "light"
                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                                    }`}
                            >
                                {selectedTheme === "light" && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <div className="w-full h-16 rounded-lg bg-white border border-slate-200 mb-3 flex items-center justify-center">
                                    <Sun className="w-6 h-6 text-amber-500" />
                                </div>
                                <p className="text-[13px] font-medium text-slate-900 dark:text-white">Açık Tema</p>
                                <p className="text-[11px] text-slate-500 dark:text-white/40">Beyaz arka plan</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedTheme("dark")}
                                className={`relative p-4 rounded-xl border-2 transition-all ${selectedTheme === "dark"
                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                                    }`}
                            >
                                {selectedTheme === "dark" && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <div className="w-full h-16 rounded-lg bg-slate-900 border border-slate-700 mb-3 flex items-center justify-center">
                                    <Moon className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-[13px] font-medium text-slate-900 dark:text-white">Koyu Tema</p>
                                <p className="text-[11px] text-slate-500 dark:text-white/40">Koyu arka plan</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
            </div>
        </form>
    );
}
