"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "vexorabyte-pwa-install-dismissed";

export function PWAInstallPrompt() {
    const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isIos] = useState(() => {
        if (typeof window === "undefined") return false;
        return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    });
    const [isStandalone] = useState(() => {
        if (typeof window === "undefined") return false;
        return (
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true
        );
    });

    useEffect(() => {
        const dismissed = window.localStorage.getItem(DISMISS_KEY) === "1";
        const mobile = window.matchMedia("(max-width: 768px)").matches;

        if (!isStandalone && !dismissed && mobile && isIos) {
            const timer = window.setTimeout(() => setIsVisible(true), 1800);
            return () => window.clearTimeout(timer);
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            if (dismissed || isStandalone || !mobile) return;
            setInstallEvent(event as BeforeInstallPromptEvent);
            setIsVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, [isIos, isStandalone]);

    const copy = useMemo(() => {
        if (isIos) {
            return {
                title: "Menüyü telefonuna ekle",
                text: "Paylaş düğmesine basıp Ana Ekrana Ekle seçeneğini kullanabilirsin.",
                action: "Nasıl?",
            };
        }

        return {
            title: "Uygulamayı telefonuna indir",
            text: "Menüne daha hızlı ulaşmak için ana ekrana ekleyebilirsin.",
            action: "Yükle",
        };
    }, [isIos]);

    if (!isVisible || isStandalone) return null;

    async function handleInstall() {
        if (!installEvent) return;

        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === "accepted") {
            closePrompt();
        }
    }

    function closePrompt() {
        window.localStorage.setItem(DISMISS_KEY, "1");
        setIsVisible(false);
    }

    return (
        <div className="fixed inset-x-3 bottom-4 z-[70] mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-950/18 backdrop-blur-xl md:hidden">
            <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                    <Smartphone className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-slate-950">{copy.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{copy.text}</p>
                    <div className="mt-3 flex items-center gap-2">
                        {isIos ? (
                            <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                                <Share className="h-3.5 w-3.5" />
                                Paylaş menüsü
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleInstall}
                                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-3 py-2 text-xs font-black text-white"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {copy.action}
                            </button>
                        )}
                        <button type="button" onClick={closePrompt} className="text-xs font-bold text-slate-400">
                            Daha sonra
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={closePrompt}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400"
                    aria-label="PWA yükleme bildirimi kapat"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
