"use client";

import Link from "next/link";
import { QrCode, Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { forgotPassword } from "../actions";
import { SITE_NAME } from "@/lib/site";

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await forgotPassword(formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                setSuccess(true);
            }
        });
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0d] flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
                            <QrCode className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{SITE_NAME}</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none">
                    {success ? (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-500/10 text-green-500 mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                E-posta Gönderildi!
                            </h1>
                            <p className="text-[14px] text-slate-500 dark:text-white/40 mb-6">
                                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-[14px] text-orange-500 hover:text-orange-600 font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 mb-4">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Şifrenizi mi Unuttunuz?
                                </h1>
                                <p className="text-[14px] text-slate-500 dark:text-white/40">
                                    E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                                    {error}
                                </div>
                            )}

                            <form action={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        E-posta
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-white/30" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="ornek@email.com"
                                            required
                                            disabled={isPending}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[14px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25 disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Bağlantı Gönder
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <Link
                                href="/auth/login"
                                className="flex items-center justify-center gap-2 mt-6 text-[14px] text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Giriş sayfasına dön
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
