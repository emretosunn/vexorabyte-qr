import { Eye, TrendingUp, Package, FolderOpen, QrCode, Plus, ArrowUpRight } from "lucide-react";
import { Header, MetricCard } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MenuQrActions } from "./MenuQrActions";

async function getDashboardData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Get restaurant
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        redirect('/onboarding');
    }

    // Get category count
    const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id);

    // Get product count
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id);

    // Get top products by view
    const { data: topProducts } = await supabase
        .from('products')
        .select(`
      id, 
      name, 
      view_count,
      categories (name)
    `)
        .eq('restaurant_id', restaurant.id)
        .order('view_count', { ascending: false })
        .limit(3);

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return {
        restaurant,
        profile,
        stats: {
            totalViews: restaurant.view_count || 0,
            categoryCount: categoryCount || 0,
            productCount: productCount || 0,
        },
        topProducts: topProducts || []
    };
}

export default async function DashboardPage() {
    const { restaurant, profile, stats, topProducts } = await getDashboardData();
    const isPremium = (profile?.plan === "premium") || ((profile as any)?.is_premium === true);
    const planLabel = isPremium ? "Premium" : "Ücretsiz";

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Dashboard" description="Restoranınızın genel durumu" />

            <div className="flex-1 p-6 space-y-6">
                {/* Welcome Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Hoş Geldiniz, {profile?.full_name?.split(' ')[0] || 'Kullanıcı'}! 👋
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <p className="text-slate-500 dark:text-white/40 text-[14px]">
                                {restaurant.name} - İşte restoranınızın günlük özeti
                            </p>
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${isPremium
                                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10"
                                }`}>
                                Plan: {planLabel}
                            </span>
                        </div>
                    </div>
                    <Link
                        href={`/menu/${restaurant.slug}`}
                        target="_blank"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                    >
                        <QrCode className="w-4 h-4" />
                        Menüyü Görüntüle
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Toplam Görüntülenme"
                        value={stats.totalViews.toLocaleString('tr-TR')}
                        description="Menü görüntülenme sayısı"
                        icon={Eye}
                    />
                    <MetricCard
                        title="Bugünkü Görüntülenme"
                        value="0"
                        description="Bugün menünüzü görüntüleyenler"
                        icon={TrendingUp}
                    />
                    <MetricCard
                        title="Toplam Ürün"
                        value={stats.productCount.toString()}
                        description="Aktif menü öğeleri"
                        icon={Package}
                    />
                    <MetricCard
                        title="Kategori Sayısı"
                        value={stats.categoryCount.toString()}
                        description="Menü kategorileri"
                        icon={FolderOpen}
                    />
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Quick Actions */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-4">
                            Hızlı İşlemler
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/urunler?new=true"
                                className="group flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="text-[13px] font-medium text-slate-900 dark:text-white block">Yeni Ürün</span>
                                    <span className="text-[11px] text-slate-500 dark:text-white/30">Menüye ekle</span>
                                </div>
                            </Link>
                            <Link
                                href="/kategoriler?new=true"
                                className="group flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-orange-300 dark:hover:border-orange-500/30 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors">
                                    <FolderOpen className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="text-[13px] font-medium text-slate-900 dark:text-white block">Kategori Ekle</span>
                                    <span className="text-[11px] text-slate-500 dark:text-white/30">Yeni kategori</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Popular Items */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                                En Çok Görüntülenen
                            </h3>
                            <Link
                                href="/urunler"
                                className="text-[12px] text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 flex items-center gap-1 transition-colors"
                            >
                                Tümünü Gör <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {topProducts.length > 0 ? (
                                topProducts.map((item: any, index: number) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 text-[12px] font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-medium text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-[11px] text-slate-500 dark:text-white/30">{item.categories?.name || 'Kategorisiz'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[12px] text-slate-500 dark:text-white/40">
                                            <Eye className="w-3.5 h-3.5" />
                                            {item.view_count || 0}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-3" />
                                    <p className="text-[13px] text-slate-500 dark:text-white/40">
                                        Henüz ürün eklenmemiş
                                    </p>
                                    <Link
                                        href="/urunler?new=true"
                                        className="inline-flex items-center gap-1 mt-2 text-[12px] text-orange-500 hover:text-orange-600 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        İlk ürününü ekle
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Restaurant Info Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/5 to-amber-500/5 border border-orange-200 dark:border-orange-500/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-1">
                                Menü Linkiniz
                            </h3>
                            <p className="text-[13px] text-slate-600 dark:text-white/60">
                                /menu/<span className="font-medium text-orange-500">{restaurant.slug}</span>
                            </p>
                        </div>
                        <MenuQrActions slug={restaurant.slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
