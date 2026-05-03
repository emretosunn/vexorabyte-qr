"use client";

import { LogOut, Loader2 } from "lucide-react";
import { signout } from "@/app/auth/actions";
import { useTransition } from "react";

interface SignOutButtonProps {
    variant?: "icon" | "full";
    className?: string;
}

export function SignOutButton({ variant = "icon", className }: SignOutButtonProps) {
    const [isPending, startTransition] = useTransition();

    function handleSignOut() {
        startTransition(async () => {
            await signout();
        });
    }

    if (variant === "full") {
        return (
            <button
                onClick={handleSignOut}
                disabled={isPending}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 ${className}`}
            >
                {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <LogOut className="w-4 h-4" />
                )}
                Çıkış Yap
            </button>
        );
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={isPending}
            className={`text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50 ${className}`}
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
        </button>
    );
}
