"use client";

import { Check, Copy, Download, QrCode } from "lucide-react";
import { useMemo, useState } from "react";
import QRCode from "qrcode";

interface MenuQrActionsProps {
    slug: string;
}

export function MenuQrActions({ slug }: MenuQrActionsProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const menuUrl = useMemo(() => {
        if (typeof window === "undefined") return `/menu/${slug}`;
        return `${window.location.origin}/menu/${slug}`;
    }, [slug]);

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch {
            setIsCopied(false);
        }
    }

    async function handleDownloadQr() {
        try {
            setIsDownloading(true);
            const dataUrl = await QRCode.toDataURL(menuUrl, {
                errorCorrectionLevel: "H",
                margin: 1,
                width: 1024,
                color: {
                    dark: "#111827",
                    light: "#ffffff",
                },
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${slug}-menu-qr.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[13px] font-medium text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20 transition-colors inline-flex items-center gap-2"
            >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {isCopied ? "Kopyalandı" : "Linki Kopyala"}
            </button>
            <button
                onClick={handleDownloadQr}
                disabled={isDownloading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center gap-2"
            >
                {isDownloading ? <Download className="w-4 h-4 animate-pulse" /> : <QrCode className="w-4 h-4" />}
                {isDownloading ? "Hazırlanıyor..." : "QR Kod İndir (PNG)"}
            </button>
        </div>
    );
}
