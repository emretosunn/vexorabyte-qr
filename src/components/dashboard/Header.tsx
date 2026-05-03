import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
    title?: string;
    description?: string;
}

export function Header({ title = "Dashboard", description }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-[#13131a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-[13px] text-slate-500 dark:text-white/40">{description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Search */}
                <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 text-[13px] hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Ara...</span>
                    <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[11px] text-slate-400 dark:text-white/30 ml-4 border border-slate-200 dark:border-transparent">
                        ⌘K
                    </kbd>
                </button>

                {/* Notifications */}
                <button className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white dark:ring-[#13131a]" />
                </button>

                {/* User Avatar */}
                <Avatar className="w-9 h-9 ring-2 ring-slate-200 dark:ring-white/10 cursor-pointer hover:ring-orange-500/50 transition-all">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-medium">
                        ET
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
