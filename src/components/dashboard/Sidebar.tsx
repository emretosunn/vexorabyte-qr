"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  UtensilsCrossed,
  Settings,
  QrCode,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site";
import { SignOutButton } from "./SignOutButton";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kategoriler",
    href: "/kategoriler",
    icon: FolderOpen,
  },
  {
    name: "Ürünler",
    href: "/urunler",
    icon: UtensilsCrossed,
  },
  {
    name: "Ayarlar",
    href: "/ayarlar",
    icon: Settings,
  },
];

interface SidebarProps {
  restaurantName?: string;
  plan?: string;
}

export function Sidebar({ restaurantName, plan }: SidebarProps) {
  const pathname = usePathname();

  const displayName = restaurantName || "Restoran";
  const displayPlan = plan || "free";
  const planLabel = displayPlan === "pro" ? "Pro Plan" : displayPlan === "business" ? "Business Plan" : "Free Plan";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white dark:bg-[#18181f] border-r border-slate-200 dark:border-white/5">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
          <QrCode className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-slate-900 dark:text-white tracking-tight">{SITE_NAME}</span>
          <span className="text-[11px] text-slate-500 dark:text-white/40">Yönetim Paneli</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider px-3 mb-3">
          Menü
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 dark:text-white"
                  : "text-slate-600 dark:text-white/50 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                  isActive
                    ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                    : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 group-hover:text-slate-700 dark:group-hover:text-white/70"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                {item.name}
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-orange-500 dark:text-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-slate-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">{planLabel}</p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}
