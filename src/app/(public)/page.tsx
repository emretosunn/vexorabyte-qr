import Link from "next/link";
import { QrCode, Smartphone, BarChart3, Zap, ArrowRight, Check, Sparkles, ShieldCheck, TimerReset, PlayCircle, WandSparkles, ScanLine } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

export default function LandingPage() {
    const whatsappPremiumUrl =
        "https://wa.me/905343735072?text=Merhaba%2C%20vexorabyte%20Premium%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";
    const features = [
        {
            icon: QrCode,
            title: "Otomatik QR ve PNG indirme",
            description: "Menü linkinizden tek tıkla QR oluşturun, yüksek kalitede PNG olarak indirin.",
        },
        {
            icon: Smartphone,
            title: "Mobilde premium menü deneyimi",
            description: "Müşterileriniz telefondan hızlı açılan, modern ve akıcı bir menü deneyimi yaşar.",
        },
        {
            icon: BarChart3,
            title: "Ürün ve kategori performansı",
            description: "Hangi ürünler daha çok görüntüleniyor görün, menünüzü veriye göre iyileştirin.",
        },
        {
            icon: WandSparkles,
            title: "Sürükle-bırak kategori sıralama",
            description: "Dashboard’dan kategorileri tek hareketle sıralayın, menü anında güncellensin.",
        },
        {
            icon: TimerReset,
            title: "Realtime anlık güncelleme",
            description: "Fiyat, ürün ve kategori değişiklikleri menü sayfasına sayfa yenilemeden anında yansır.",
        },
        {
            icon: ShieldCheck,
            title: "Güvenli altyapı",
            description: "Supabase tabanlı yapı, güvenli kimlik doğrulama ve sağlam veri erişim modeli.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0d] overflow-x-hidden selection:bg-orange-200/60">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0d]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
                                <QrCode className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{SITE_NAME}</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-[14px] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Özellikler</a>
                            <a href="#pricing" className="text-[14px] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Planlar</a>
                            <a href="#flow" className="text-[14px] text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white transition-colors">Nasıl Çalışır</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/auth/login"
                                className="hidden sm:block text-[14px] font-medium text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Giriş Yap
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[14px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                            >
                                Ücretsiz Başla
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[13px] font-medium mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            Yeni nesil dijital menü — {SITE_NAME}
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                            Restoran menünüzü
                            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent"> güçlü bir dijital deneyime </span>
                            dönüştürün
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-white/50 mb-8 max-w-3xl mx-auto">
                            QR kod, canlı menü linki, sürükle-bırak kategori yönetimi ve tek tık PNG indirme ile müşterinize modern bir sipariş öncesi deneyim sunun.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth/register"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[15px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                            >
                                Ücretsiz Başla
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#features"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-[15px] font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                            >
                                <PlayCircle className="w-4 h-4" />
                                Ürünü Keşfet
                            </a>
                        </div>
                    </div>

                    {/* Visual Showcase */}
                    <div className="mt-14 grid lg:grid-cols-2 gap-6 items-stretch">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#ff9a1f] to-[#ff7a00] text-white shadow-xl">
                            <p className="text-sm font-medium text-white/90 mb-3">Neden {SITE_NAME}?</p>
                            <div className="rounded-2xl border border-white/20 p-5 bg-white/10 backdrop-blur">
                                <h3 className="text-xl font-bold text-white leading-snug">
                                    Menü yönetiminde hız, sadelik ve satış odaklı deneyim
                                </h3>
                                <p className="mt-3 text-sm text-white/85">
                                    Eski menü baskı süreçlerini kaldırın. Ürün/fiyat güncellemelerinizi anında yayınlayın ve müşterinize modern bir ilk temas deneyimi sunun.
                                </p>
                                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                                    {[
                                        "Baskı maliyetini azaltır",
                                        "Anlık fiyat güncelleme",
                                        "Müşteri deneyimini güçlendirir",
                                        "Tek panelden yönetim",
                                    ].map((item) => (
                                        <div key={item} className="rounded-xl px-1 py-1 text-sm font-medium text-white">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/auth/register"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-orange-600 px-4 py-2 text-sm font-semibold"
                                >
                                    Hemen Başla
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl">
                            <p className="text-sm font-medium text-white/90 mb-3">QR Dağıtım Paneli</p>
                            <div className="rounded-2xl bg-white/10 border border-white/20 p-5 backdrop-blur">
                                <div className="flex items-center justify-between mb-5">
                                    <p className="font-semibold">Masa Kartları İçin Hazır</p>
                                    <ScanLine className="w-5 h-5" />
                                </div>
                                <ul className="space-y-2 text-sm text-white/90">
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Tek tıkla QR oluşturma</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4" /> PNG indirme</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Link kopyalama</li>
                                    <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Realtime güncellenen menü</li>
                                </ul>
                                <Link href="/auth/register" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-orange-600 px-4 py-2 text-sm font-semibold">
                                    Şimdi Etkinleştir
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                        {[
                            { value: "1 dk", label: "Kurulum Süresi" },
                            { value: "%100", label: "Mobil Uyum" },
                            { value: "PNG", label: "QR İndirme" },
                            { value: "7/24", label: "Canlı Menü" },
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-6 rounded-2xl bg-white/80 dark:bg-white/[0.02] backdrop-blur border border-slate-200 dark:border-white/5 hover:scale-[1.02] transition-transform">
                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Ürünün kalbinde hız ve dönüşüm var
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
                            Menünüzü sadece yönetmek için değil, satış etkisini artırmak için tasarlanmış bir altyapı.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white/80 dark:bg-white/[0.02] backdrop-blur border border-slate-200 dark:border-white/5 hover:border-orange-200 dark:hover:border-orange-500/20 hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 mb-4 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-[14px] text-slate-600 dark:text-white/50">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flow Section */}
            <section id="flow" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            3 adımda canlıya alın
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { step: "01", title: "Restoranı oluştur", text: "Ad, açıklama ve slug ile menünüzün herkese açık linkini oluşturun." },
                            { step: "02", title: "Kategori ve ürünleri ekle", text: "Kategorileri sürükleyerek sıralayın, ürünleri anında yayına alın." },
                            { step: "03", title: "QR indir ve masalara koy", text: "Dashboard’dan PNG QR indirip bastırın, müşteri anında menüye ulaşsın." },
                        ].map((item) => (
                            <div key={item.step} className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                                <span className="text-sm font-semibold text-orange-500">{item.step}</span>
                                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="mt-2 text-[14px] text-slate-600 dark:text-white/50">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Basit plan yapısı
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
                            Ücretsiz planda limitli, Premium planda sınırsız kullanım
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                name: "Ücretsiz Beta",
                                price: "0 TL",
                                description: "Hızlıca başlamak isteyenler için",
                                features: ["1 Restoran", "En fazla 15 kategori", "En fazla 100 ürün", "QR Kod + PNG indirme", "Realtime menü güncelleme"],
                                popular: true,
                                ctaLabel: "Hemen Başla",
                                ctaType: "register"
                            },
                            {
                                name: "Pro",
                                price: "₺99",
                                period: "/ay",
                                description: "WhatsApp ile aktivasyon",
                                features: ["Sınırsız kategori", "Sınırsız ürün", "Sınırsız yönetim esnekliği", "Öncelikli destek", "Manuel Premium açılış"],
                                popular: false,
                                ctaLabel: "WhatsApp'tan Ulaş",
                                ctaType: "whatsapp"
                            },
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`relative p-6 rounded-2xl border transition-all ${plan.popular
                                        ? "bg-gradient-to-b from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/5 border-orange-200 dark:border-orange-500/30 shadow-xl"
                                        : "bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-medium">
                                        En Popüler
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                                        {plan.period && <span className="text-slate-500 dark:text-white/40">{plan.period}</span>}
                                    </div>
                                    <p className="text-[13px] text-slate-500 dark:text-white/40 mt-2">{plan.description}</p>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[14px] text-slate-700 dark:text-white/70">
                                            <Check className="w-4 h-4 text-orange-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                {plan.ctaType === "whatsapp" ? (
                                    <a
                                        href={whatsappPremiumUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`w-full py-3 rounded-xl text-[14px] font-medium transition-all text-center block ${plan.popular
                                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/25"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                                            }`}
                                    >
                                        {plan.ctaLabel}
                                    </a>
                                ) : (
                                    <Link
                                        href="/auth/register"
                                        className={`w-full py-3 rounded-xl text-[14px] font-medium transition-all text-center block ${plan.popular
                                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/25"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
                                            }`}
                                    >
                                        {plan.ctaLabel}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-10 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Menünüzü bugün dijitale taşıyın
                        </h2>
                        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                            Kurulumdan QR indirime kadar tüm akış tek panelde. Teknik bilgi gerekmez.
                        </p>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-orange-600 text-[15px] font-medium hover:bg-white/90 transition-colors"
                        >
                            Ücretsiz Hesap Oluştur
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500">
                                <QrCode className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{SITE_NAME}</span>
                        </div>
                        <div className="flex items-center gap-6 text-[13px] text-slate-500 dark:text-white/40">
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Gizlilik</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Kullanım Şartları</a>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">İletişim</a>
                        </div>
                        <p className="text-[13px] text-slate-400 dark:text-white/30">
                            © 2026 {SITE_NAME}. Tüm hakları saklıdır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
