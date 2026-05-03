"use client";

import { QrCode, Store, FileText, Phone, Globe, Sun, Moon, ArrowRight, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createRestaurant } from "./actions";

export default function OnboardingPage() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [restaurantName, setRestaurantName] = useState("");
    const [slug, setSlug] = useState("");
    const [isManuallyEdited, setIsManuallyEdited] = useState(false);

    // Generate slug from name
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50);
    };

    // Update slug when name changes, unless manually edited
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setRestaurantName(newName);
        if (!isManuallyEdited) {
            setSlug(generateSlug(newName));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(generateSlug(e.target.value));
        setIsManuallyEdited(true);
    };

    async function handleSubmit(formData: FormData) {
        setError(null);
        formData.set('theme', theme);
        // Ensure the slug is sent
        formData.set('slug', slug);

        startTransition(async () => {
            // ... existing submit logic
            const result = await createRestaurant(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0d] py-8 px-4">
            {/* Background Pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mb-4">
                        <QrCode className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Restoranınızı Oluşturun
                    </h1>
                    <p className="text-[14px] text-slate-500 dark:text-white/40">
                        Birkaç adımda dijital menünüzü oluşturmaya başlayın
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px] max-w-md mx-auto">
                        {error}
                    </div>
                )}

                <form action={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Restaurant Info Card */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-500">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Restoran Bilgileri</h2>
                                    <p className="text-[12px] text-slate-500 dark:text-white/40">Temel bilgilerinizi düzenleyin</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Restaurant Name */}
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Restoran Adı
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={restaurantName}
                                        onChange={handleNameChange}
                                        placeholder="Lezzet Durağı"
                                        required
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Açıklama
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="En lezzetli yemekler, en güzel anılar..."
                                        rows={3}
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all resize-none disabled:opacity-50"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Telefon
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+90 555 123 4567"
                                            disabled={isPending}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Menu URL Card */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-500">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Menü URL</h2>
                                        <p className="text-[12px] text-slate-500 dark:text-white/40">Benzersiz menü adresiniz</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        URL Slug <span className="text-slate-400 dark:text-white/30">(Benzersiz olmalı)</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="px-4 py-3 rounded-l-xl bg-slate-100 dark:bg-white/5 border border-r-0 border-slate-200 dark:border-white/10 text-[14px] text-slate-500 dark:text-white/40">
                                            qrmenuly.com/
                                        </div>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={slug}
                                            onChange={handleSlugChange}
                                            placeholder="restoran-adi"
                                            required
                                            disabled={isPending}
                                            className="flex-1 px-4 py-3 rounded-r-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>


                                {slug && (
                                    <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                        <div className="flex items-center gap-2 text-[12px] text-green-600 dark:text-green-400">
                                            <Globe className="w-4 h-4" />
                                            <span>Menünüz yayında:</span>
                                        </div>
                                        <p className="text-[13px] font-medium text-green-700 dark:text-green-300 mt-1">
                                            qrmenuly.com/{slug}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Theme Selector Card */}
                            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-500">
                                        <Sun className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Panel Teması</h2>
                                        <p className="text-[12px] text-slate-500 dark:text-white/40">Dashboard görünümü</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTheme("light")}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${theme === "light"
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                            : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                                            }`}
                                    >
                                        {theme === "light" && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-white border border-slate-200">
                                            <Sun className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-900 dark:text-white">Açık Tema</p>
                                        <p className="text-[11px] text-slate-500 dark:text-white/40">Beyaz arka plan</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setTheme("dark")}
                                        className={`relative p-4 rounded-xl border-2 transition-all ${theme === "dark"
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10"
                                            : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                                            }`}
                                    >
                                        {theme === "dark" && (
                                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-800 border border-slate-700">
                                            <Moon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-[13px] font-medium text-slate-900 dark:text-white">Koyu Tema</p>
                                        <p className="text-[11px] text-slate-500 dark:text-white/40">Koyu arka plan</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending || !restaurantName}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[14px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 disabled:opacity-50"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Restoranı Oluştur
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
