import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: MetricCardProps) {
    return (
        <div
            className={cn(
                "group relative p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg dark:hover:bg-white/[0.04] transition-all duration-300",
                className
            )}
        >
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-medium text-slate-500 dark:text-white/40">
                        {title}
                    </span>
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>

                {description && (
                    <p className="text-[12px] text-slate-400 dark:text-white/30">{description}</p>
                )}

                {trend && (
                    <div className="flex items-center gap-2 mt-3">
                        <span
                            className={cn(
                                "text-[11px] font-medium px-2 py-1 rounded-lg",
                                trend.isPositive
                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                            )}
                        >
                            {trend.isPositive ? "+" : "-"}
                            {Math.abs(trend.value)}%
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-white/30">geçen haftaya göre</span>
                    </div>
                )}
            </div>
        </div>
    );
}
