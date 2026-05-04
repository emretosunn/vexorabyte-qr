import {
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    ClipboardList,
    Eye,
    FolderOpen,
    ImagePlus,
    Info,
    Link2,
    Package,
    Plus,
    QrCode,
    Settings,
    Store,
    TrendingUp,
} from "lucide-react";
import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MenuQrActions } from "./MenuQrActions";

type Profile = {
    full_name: string | null;
    plan?: string | null;
    is_premium?: boolean | null;
};

type Restaurant = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    phone: string | null;
    address: string | null;
    logo_url: string | null;
    cover_image_url: string | null;
    is_active: boolean | null;
    view_count: number | null;
};

type TopProduct = {
    id: string;
    name: string;
    view_count: number | null;
    categories: { name: string | null } | null;
};

async function getDashboardData() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle<Restaurant>();

    if (!restaurant) {
        redirect("/onboarding");
    }

    const { count: categoryCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id);

    const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurant.id);

    const { data: topProducts } = await supabase
        .from("products")
        .select(`
            id,
            name,
            view_count,
            categories (name)
        `)
        .eq("restaurant_id", restaurant.id)
        .order("view_count", { ascending: false })
        .limit(4)
        .returns<TopProduct[]>();

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, plan, is_premium")
        .eq("id", user.id)
        .maybeSingle<Profile>();

    return {
        restaurant,
        profile,
        stats: {
            totalViews: restaurant.view_count || 0,
            categoryCount: categoryCount || 0,
            productCount: productCount || 0,
        },
        topProducts: topProducts || [],
    };
}

function getCompletionItems(restaurant: Restaurant, stats: { categoryCount: number; productCount: number }) {
    return [
        {
            label: "Restoran bilgileri",
            complete: Boolean(restaurant.name && restaurant.description),
            detail: "Müşteri menüye girince işletmenizi tanır.",
            href: "/ayarlar",
        },
        {
            label: "İletişim bilgileri",
            complete: Boolean(restaurant.phone || restaurant.address),
            detail: "Telefon veya adres eklemek güven verir.",
            href: "/ayarlar",
        },
        {
            label: "Kategori düzeni",
            complete: stats.categoryCount > 0,
            detail: "Menü bölümleri müşterinin aradığını hızlı bulmasını sağlar.",
            href: "/kategoriler",
        },
        {
            label: "Ürün listesi",
            complete: stats.productCount > 0,
            detail: "Fotoğraflı ve açıklamalı ürünler sipariş kararını hızlandırır.",
            href: "/urunler",
        },
    ];
}

export default async function DashboardPage() {
    const { restaurant, profile, stats, topProducts } = await getDashboardData();
    const isPremium = profile?.plan === "premium" || profile?.is_premium === true;
    const planLabel = isPremium ? "Premium" : "Ücretsiz";
    const firstName = profile?.full_name?.split(" ")[0] || "Merhaba";
    const completionItems = getCompletionItems(restaurant, stats);
    const completedCount = completionItems.filter((item) => item.complete).length;
    const completionPercent = Math.round((completedCount / completionItems.length) * 100);
    const menuStatusLabel = restaurant.is_active === false ? "Menü kapalı" : "Menü yayında";
    const menuStatusClass =
        restaurant.is_active === false
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200";

    const summaryCards = [
        {
            title: "Menü görüntülenmesi",
            value: stats.totalViews.toLocaleString("tr-TR"),
            description: "Müşteriler menünüzü toplam kaç kez açtı.",
            icon: Eye,
            tone: "orange",
        },
        {
            title: "Menüdeki ürünler",
            value: stats.productCount.toString(),
            description: "Müşterinin görebileceği ürün sayısı.",
            icon: Package,
            tone: "blue",
        },
        {
            title: "Kategori sayısı",
            value: stats.categoryCount.toString(),
            description: "Menünüzdeki ana bölümler.",
            icon: FolderOpen,
            tone: "violet",
        },
        {
            title: "Hazırlık skoru",
            value: `%${completionPercent}`,
            description: "Menünüzün müşteriye hazır görünme düzeyi.",
            icon: CheckCircle2,
            tone: "emerald",
        },
    ];

    const nextSteps = [
        stats.categoryCount === 0
            ? {
                  title: "Önce kategori ekleyin",
                  description: "Örneğin: Kahvaltı, Ana Yemekler, İçecekler, Tatlılar.",
                  href: "/kategoriler?new=true",
                  cta: "Kategori ekle",
                  icon: FolderOpen,
              }
            : null,
        stats.productCount === 0
            ? {
                  title: "İlk ürününüzü ekleyin",
                  description: "Ürün adı, fiyatı, açıklaması ve fotoğrafı menüyü dolu gösterir.",
                  href: "/urunler?new=true",
                  cta: "Ürün ekle",
                  icon: Package,
              }
            : null,
        !restaurant.description || !restaurant.phone
            ? {
                  title: "İşletme bilgilerini tamamlayın",
                  description: "Açıklama, telefon ve adres müşteride güven hissi oluşturur.",
                  href: "/ayarlar",
                  cta: "Ayarları aç",
                  icon: Settings,
              }
            : null,
    ].filter((item): item is NonNullable<typeof item> => item !== null);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-[#0a0a0d]">
            <Header title="Dashboard" description="Restoranınızın günlük kontrol merkezi" />

            <div className="flex-1 space-y-6 p-4 sm:p-6">
                <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="relative p-6 sm:p-7">
                            <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-[4rem] bg-orange-500/10" />
                            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${menuStatusClass}`}>
                                            {menuStatusLabel}
                                        </span>
                                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                                            Plan: {planLabel}
                                        </span>
                                    </div>
                                    <h2 className="max-w-3xl text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-4xl">
                                        Hoş geldiniz, {firstName}
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-white/55">
                                        {restaurant.name} için menünüzün durumu, QR bağlantınız ve yapılacak önemli işler burada. Bu ekranı her gün kısa bir işletme kontrolü gibi düşünebilirsiniz.
                                    </p>
                                </div>
                                <Link
                                    href={`/menu/${restaurant.slug}`}
                                    target="_blank"
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition-opacity hover:opacity-90"
                                >
                                    <QrCode className="h-4 w-4" />
                                    Menüyü görüntüle
                                </Link>
                            </div>

                            <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Menü adresi</p>
                                    <p className="mt-2 break-all text-sm font-black text-slate-900 dark:text-white">/menu/{restaurant.slug}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Müşteri etkisi</p>
                                    <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">
                                        {stats.totalViews > 0 ? "Menünüz görüntülenmeye başlamış" : "QR paylaşınca ilk görüntülenmeler gelir"}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Sonraki odak</p>
                                    <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">
                                        {nextSteps[0]?.title || "Menünüz iyi durumda"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-500/15 dark:from-orange-500/10 dark:to-amber-500/5">
                        <div className="flex items-start gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm dark:bg-white/10">
                                <QrCode className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">QR ve menü linki</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/55">
                                    Masa üstü kart, sosyal medya veya WhatsApp için bu bağlantıyı kullanın.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 rounded-2xl border border-orange-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.06]">
                            <p className="break-all text-sm font-bold text-slate-800 dark:text-white">/menu/{restaurant.slug}</p>
                        </div>
                        <div className="mt-4">
                            <MenuQrActions slug={restaurant.slug} />
                        </div>
                    </aside>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.03]">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-white/45">{card.title}</p>
                                    <p className="mt-4 text-4xl font-black text-slate-950 dark:text-white">{card.value}</p>
                                </div>
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300">
                                    <card.icon className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-white/40">{card.description}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Menü hazırlık durumu</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-white/40">Müşterinin menüyü daha güvenilir görmesi için temel adımlar.</p>
                            </div>
                            <span className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white dark:bg-white dark:text-slate-950">
                                %{completionPercent}
                            </span>
                        </div>
                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${completionPercent}%` }} />
                        </div>
                        <div className="mt-5 space-y-3">
                            {completionItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-orange-500/5"
                                >
                                    <CheckCircle2 className={`mt-0.5 h-5 w-5 ${item.complete ? "text-emerald-500" : "text-slate-300 dark:text-white/25"}`} />
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-black text-slate-900 dark:text-white">{item.label}</span>
                                        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-white/40">{item.detail}</span>
                                    </span>
                                    <ArrowRight className="mt-1 h-4 w-4 text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Hızlı işlemler</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-white/40">Menünüzü büyütmek için en çok kullanılan adımlar.</p>
                            </div>
                            <Link href="/urunler" className="inline-flex items-center gap-1 text-sm font-bold text-orange-600">
                                Ürünlere git <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                                { title: "Yeni ürün ekle", text: "Fiyat, açıklama ve fotoğraf girin.", href: "/urunler?new=true", icon: Plus },
                                { title: "Kategori düzenle", text: "Menü sırasını müşteriye göre ayarlayın.", href: "/kategoriler", icon: FolderOpen },
                                { title: "Fotoğraf ekle", text: "Ürünleri daha iştah açıcı gösterin.", href: "/urunler", icon: ImagePlus },
                                { title: "İşletme ayarları", text: "Telefon, adres ve açıklamayı güncelleyin.", href: "/ayarlar", icon: Settings },
                            ].map((action) => (
                                <Link
                                    key={action.title}
                                    href={action.href}
                                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-orange-500/5"
                                >
                                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm transition-colors group-hover:bg-orange-600 group-hover:text-white dark:bg-white/10">
                                        <action.icon className="h-5 w-5" />
                                    </div>
                                    <h4 className="mt-4 text-sm font-black text-slate-950 dark:text-white">{action.title}</h4>
                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">{action.text}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">En çok görüntülenen ürünler</h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-white/40">Müşterinin ilgisini çeken ürünleri buradan takip edin.</p>
                            </div>
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="mt-5 space-y-3">
                            {topProducts.length > 0 ? (
                                topProducts.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 text-sm font-black text-orange-600 dark:bg-orange-500/10">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-black text-slate-950 dark:text-white">{item.name}</p>
                                                <p className="mt-1 text-xs text-slate-500 dark:text-white/40">{item.categories?.name || "Kategorisiz"}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-slate-500 dark:text-white/45">
                                            <Eye className="h-4 w-4" />
                                            {item.view_count || 0}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                                    <Package className="mx-auto h-10 w-10 text-slate-300" />
                                    <h4 className="mt-4 text-sm font-black text-slate-900 dark:text-white">Henüz ürün yok</h4>
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-white/40">
                                        İlk ürünlerinizi eklediğinizde müşterilerin en çok baktığı ürünler burada listelenir.
                                    </p>
                                    <Link href="/urunler?new=true" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white">
                                        İlk ürünü ekle
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">
                                    <ClipboardList className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-950 dark:text-white">Sıradaki öneriler</h3>
                                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/40">
                                        Bu liste menünüzde eksik görünen alanlara göre otomatik şekillenir.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3">
                                {nextSteps.length > 0 ? (
                                    nextSteps.map((step) => (
                                        <Link key={step.title} href={step.href} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-orange-50 dark:bg-white/[0.03] dark:hover:bg-orange-500/5">
                                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-white/10">
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-black text-slate-950 dark:text-white">{step.title}</p>
                                                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-white/40">{step.description}</p>
                                            </div>
                                            <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-600 shadow-sm sm:inline-flex dark:bg-white/10">
                                                {step.cta}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        Temel kurulum tamam görünüyor. Şimdi QR kodu masalara yerleştirip görüntülenmeleri takip edebilirsiniz.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-950 dark:text-white">İşletme notu</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/45">
                                        Bugünkü görüntülenme için ayrı günlük kayıt tablosu bulunmadığından yanlış sayı göstermiyoruz. Şu an güvenilir metrik toplam görüntülenme ve ürün bazlı görüntülenmedir.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                                    <Store className="h-5 w-5 text-orange-500" />
                                    <p className="mt-3 text-sm font-black text-slate-950 dark:text-white">Restoran adı</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-white/40">{restaurant.name}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.03]">
                                    <Link2 className="h-5 w-5 text-orange-500" />
                                    <p className="mt-3 text-sm font-black text-slate-950 dark:text-white">Public menü</p>
                                    <p className="mt-1 break-all text-sm text-slate-500 dark:text-white/40">/menu/{restaurant.slug}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
