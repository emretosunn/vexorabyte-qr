import Link from "next/link";
import {
    ArrowRight,
    BarChart3,
    Check,
    ChevronRight,
    Eye,
    FolderOpen,
    ImagePlus,
    Layers3,
    LayoutDashboard,
    MousePointer2,
    Package,
    QrCode,
    ScanLine,
    ShieldCheck,
    Sparkles,
    WandSparkles,
    Zap,
} from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { BrandLogo } from "@/components/BrandLogo";

const whatsappPremiumUrl =
    "https://wa.me/905343735072?text=Merhaba%2C%20vexorabyte%20Premium%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

const metrics = [
    { value: "1 dk", label: "kurulum" },
    { value: "PNG", label: "QR indirme" },
    { value: "7/24", label: "canlı menü" },
    { value: "%100", label: "mobil uyum" },
];

const features = [
    {
        icon: LayoutDashboard,
        title: "Tek panelden menü yönetimi",
        description: "Restoran bilgisi, kategoriler, ürünler, fiyatlar ve menü linki aynı panelde düzenlenir.",
    },
    {
        icon: QrCode,
        title: "Restorana özel QR kod",
        description: "Menü linkinizden yüksek kaliteli QR üretin, PNG olarak indirip masa kartlarına yerleştirin.",
    },
    {
        icon: WandSparkles,
        title: "Sürükle-bırak kategori sırası",
        description: "Kategorileri panelden taşıyın; müşterinin gördüğü menü sırası anında değişsin.",
    },
    {
        icon: ImagePlus,
        title: "Ürün fotoğrafı ve açıklama",
        description: "Ürünlerinizi görsel, fiyat ve açıklama ile zenginleştirerek karar vermeyi kolaylaştırın.",
    },
    {
        icon: BarChart3,
        title: "Görüntülenme takibi",
        description: "Toplam menü görüntülenmesi ve öne çıkan ürünlerle menünüzü veriye göre geliştirin.",
    },
    {
        icon: ShieldCheck,
        title: "Güvenli işletme altyapısı",
        description: "Hesap koruması, yetkili erişim ve güvenli veri yönetimi restoran panelinizi korur.",
    },
];

const flow = [
    {
        step: "01",
        title: "Restoranını oluştur",
        description: "Kayıt sonrası restoran adını, açıklamasını ve benzersiz menü adresini belirle.",
        icon: Sparkles,
    },
    {
        step: "02",
        title: "Menünü düzenle",
        description: "Kategorileri ve ürünleri ekle, fotoğrafları yükle, sıralamayı istediğin gibi ayarla.",
        icon: Layers3,
    },
    {
        step: "03",
        title: "QR kodu masaya koy",
        description: "PNG QR kodunu indir, bastır ve müşterinin telefonundan açılan menüyü yayına al.",
        icon: ScanLine,
    },
];

const comparisons = [
    "Baskı beklemeden fiyat güncelleme",
    "Her masa için tek, kalıcı menü linki",
    "Mobilde hızlı açılan public menü",
    "Ücretsiz başlangıç ve Premium büyüme alanı",
];

const menuItems = [
    { name: "Trüflü Burger", price: "₺320", views: "1.284" },
    { name: "Füme Kaburga Taco", price: "₺245", views: "986" },
    { name: "Limonlu Cheesecake", price: "₺175", views: "742" },
];

export default function LandingPage() {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#fffaf2] text-slate-950 selection:bg-orange-200/70">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(249,115,22,0.16),transparent_28%),radial-gradient(circle_at_78%_4%,rgba(20,184,166,0.12),transparent_25%),linear-gradient(180deg,#fffaf2_0%,#fff7ed_42%,#f8fafc_100%)]" />

            <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-950/10 bg-[#fffaf2]/82 backdrop-blur-2xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-3" aria-label={`${SITE_NAME} ana sayfa`}>
                        <BrandLogo className="h-10 w-10 rounded-2xl shadow-lg shadow-orange-500/15" priority />
                        <span className="text-lg font-black tracking-normal">{SITE_NAME}</span>
                    </Link>

                    <div className="hidden items-center gap-7 md:flex">
                        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950" href="#urun">
                            Ürün
                        </a>
                        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950" href="#akış">
                            Akış
                        </a>
                        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950" href="#planlar">
                            Planlar
                        </a>
                        <a className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950" href="#sss">
                            SSS
                        </a>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/auth/login"
                            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white/70 hover:text-slate-950 sm:inline-flex"
                        >
                            Giriş
                        </Link>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5"
                        >
                            Kayıt ol
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="relative px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
                <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="landing-reveal">
                        <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
                            Menünüz artık sadece okunmaz, satışa çalışır.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                            {SITE_NAME}; restoranınız için QR kod, mobil menü, ürün fotoğrafları, kategori yönetimi ve görüntülenme takibini tek, sade ve hızlı bir panelde toplar.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/auth/register"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-4 text-sm font-black text-white shadow-2xl shadow-orange-600/25 transition-transform hover:-translate-y-0.5"
                            >
                                Menümü ücretsiz oluştur
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <a
                                href="#urun"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-950/10 bg-white/75 px-6 py-4 text-sm font-black text-slate-950 shadow-sm transition-colors hover:bg-white"
                            >
                                Sistemi gör
                                <MousePointer2 className="h-4 w-4" />
                            </a>
                        </div>
                        <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="rounded-3xl border border-slate-950/10 bg-white/65 p-4 shadow-sm backdrop-blur">
                                    <p className="text-2xl font-black text-slate-950">{metric.value}</p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <HeroDeviceShowcase />

                    <div className="hidden">
                        <div className="absolute left-0 top-24 w-[88%] rounded-[2.25rem] border border-slate-950/10 bg-slate-950 p-3 shadow-2xl shadow-slate-950/30 sm:w-[76%] lg:left-4">
                            <div className="rounded-[1.65rem] bg-[#101827] p-5 text-white">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Dashboard</p>
                                        <h2 className="mt-1 text-xl font-black">Luna Bistro</h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">Yayında</span>
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-3">
                                    <div className="rounded-2xl bg-white/8 p-3">
                                        <Eye className="h-4 w-4 text-orange-300" />
                                        <p className="mt-3 text-2xl font-black">8.4k</p>
                                        <p className="text-xs text-white/45">Görüntülenme</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/8 p-3">
                                        <Package className="h-4 w-4 text-teal-300" />
                                        <p className="mt-3 text-2xl font-black">126</p>
                                        <p className="text-xs text-white/45">Ürün</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/8 p-3">
                                        <FolderOpen className="h-4 w-4 text-amber-300" />
                                        <p className="mt-3 text-2xl font-black">14</p>
                                        <p className="text-xs text-white/45">Kategori</p>
                                    </div>
                                </div>
                                <div className="mt-5 space-y-3">
                                    {menuItems.map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between rounded-2xl bg-white/[0.07] p-3">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-sm font-black">{index + 1}</span>
                                                <div>
                                                    <p className="text-sm font-black">{item.name}</p>
                                                    <p className="text-xs text-white/45">{item.views} görüntülenme</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-orange-200">{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5 rounded-2xl bg-orange-500 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black">Menü linki</p>
                                            <p className="text-xs text-white/75">/menu/luna-bistro</p>
                                        </div>
                                        <ScanLine className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-[56%] min-w-[230px] rounded-[2.5rem] border-[10px] border-slate-950 bg-white shadow-2xl shadow-slate-950/25 sm:w-[42%] lg:right-6">
                            <div className="rounded-[1.55rem] bg-white p-4">
                                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-200" />
                                <div className="rounded-3xl bg-orange-50 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600">Luna Bistro</p>
                                    <h3 className="mt-2 text-2xl font-black leading-tight">Bugünün menüsü</h3>
                                </div>
                                <div className="mt-4 flex gap-2 overflow-hidden">
                                    {["Kahvaltı", "Ana yemek", "Tatlı"].map((item, index) => (
                                        <span key={item} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${index === 0 ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 space-y-3">
                                    {["Avokadolu tost", "Soğuk latte", "San Sebastian"].map((item) => (
                                        <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-2">
                                            <span className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-200 to-teal-100" />
                                            <div>
                                                <p className="text-sm font-black">{item}</p>
                                                <p className="text-xs text-slate-500">Fotoğraflı ürün</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="urun" className="border-y border-slate-950/10 bg-white px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">Ürün gücü</p>
                        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                            Menü operasyonunu ağırlaştırmadan profesyonelleştirir.
                        </h2>
                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Baskı, dosya paylaşımı, eski fiyat listesi ve dağınık ürün takibi yerine restoran sahibinin her gün kullanabileceği net bir sistem.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <article key={feature.title} className="group rounded-[2rem] border border-slate-950/10 bg-[#fffaf2] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/8">
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white transition-colors group-hover:bg-orange-600">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-6 text-xl font-black">{feature.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">Neden çıkarmaz?</p>
                        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                            Çünkü sayfa sadece vaat etmiyor, restoranın gününü çözüyor.
                        </h2>
                        <p className="mt-5 text-lg leading-8 text-white/60">
                            Müşteri QR okuttuğunda modern bir menü görür. İşletme sahibi panelde saniyeler içinde değişiklik yapar. İkisi de aynı canlı veriye bakar.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {comparisons.map((item, index) => (
                            <div key={item} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6">
                                <span className="text-4xl font-black text-orange-300">0{index + 1}</span>
                                <p className="mt-5 text-lg font-black">{item}</p>
                                <div className="mt-5 h-2 rounded-full bg-white/10">
                                    <div className="h-2 rounded-full bg-orange-400" style={{ width: `${72 + index * 7}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="akış" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-3xl">
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">Kurulum akışı</p>
                            <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                                Dakikalar içinde yayına alın.
                            </h2>
                        </div>
                        <Link href="/auth/register" className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
                            İlk adımı at
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">
                        {flow.map((item) => (
                            <article key={item.step} className="relative overflow-hidden rounded-[2rem] border border-slate-950/10 bg-white p-7 shadow-sm">
                                <div className="absolute -right-8 -top-8 text-[8rem] font-black leading-none text-slate-950/[0.04]">{item.step}</div>
                                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-orange-600">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-slate-400">{item.step}</p>
                                <h3 className="mt-2 text-2xl font-black">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="planlar" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">Planlar</p>
                        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                            Başlamak kolay, büyümek kontrollü.
                        </h2>
                    </div>
                    <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
                        <article className="rounded-[2rem] border border-slate-950/10 bg-[#fffaf2] p-7 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black">Ücretsiz Beta</h3>
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">Popüler</span>
                            </div>
                            <p className="mt-4 text-5xl font-black">0 TL</p>
                            <p className="mt-3 text-sm leading-7 text-slate-600">Menüyü dijitale taşımak isteyen restoranlar için hızlı başlangıç.</p>
                            <ul className="mt-7 space-y-3">
                                {["1 restoran", "15 kategoriye kadar", "100 ürüne kadar", "QR kod ve PNG indirme", "Canlı menü linki"].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                        <Check className="h-4 w-4 text-orange-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/auth/register" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-4 text-sm font-black text-white">
                                Ücretsiz hesap oluştur
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </article>

                        <article className="rounded-[2rem] border border-slate-950 bg-slate-950 p-7 text-white shadow-2xl shadow-slate-950/20">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black">Premium</h3>
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-orange-200">WhatsApp aktivasyon</span>
                            </div>
                            <p className="mt-4 text-5xl font-black leading-tight">Bize ulaşın</p>
                            <p className="mt-3 text-sm leading-7 text-white/60">Daha geniş menü hacmi ve öncelikli destek isteyen işletmeler için.</p>
                            <ul className="mt-7 space-y-3">
                                {["Sınırsız kategori", "Sınırsız ürün", "Öncelikli destek", "Esnek menü büyütme", "Manuel Premium açılış"].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/78">
                                        <Check className="h-4 w-4 text-orange-300" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a href={whatsappPremiumUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950">
                                Bize ulaşın
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </article>
                    </div>
                </div>
            </section>

            <section className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-orange-600 px-6 py-12 text-white shadow-2xl shadow-orange-600/20 sm:px-10 lg:px-14">
                    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                        <div>
                            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-100">
                                <Zap className="h-4 w-4" />
                                Bugün yayına hazır
                            </div>
                            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
                                Menü baskısını beklemeyin. QR menünüzü şimdi açın.
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
                                Restoranınızı oluşturun, ürünlerinizi ekleyin, QR kodu indirin. Müşterinizin ilk teması daha hızlı, daha temiz ve daha iştah açıcı olsun.
                            </p>
                        </div>
                        <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-orange-700">
                            Hemen başla
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section id="sss" className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1fr]">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">SSS</p>
                        <h2 className="mt-3 text-4xl font-black leading-tight tracking-normal">Aklına takılanlar.</h2>
                    </div>
                    <div className="grid gap-4">
                        {[
                            ["QR kodum değişir mi?", "Menü linkiniz kalıcıdır. Ürün, fiyat ve kategori güncellense de aynı QR kod müşteriyi güncel menüye götürür."],
                            ["Teknik bilgi gerekir mi?", "Hayır. Panel ürün ekleme, kategori sıralama ve QR indirme akışını sade tutar."],
                            ["Müşteri uygulama indirir mi?", "Hayır. QR kod telefon kamerasıyla açılır ve public menü tarayıcıda çalışır."],
                        ].map(([question, answer]) => (
                            <div key={question} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
                                <h3 className="font-black">{question}</h3>
                                <p className="mt-2 text-sm leading-7 text-white/60">{answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t border-slate-950/10 bg-[#fffaf2] px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <BrandLogo className="h-10 w-10 rounded-2xl" />
                        <span className="text-lg font-black">{SITE_NAME}</span>
                    </Link>
                    <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-600">
                        <Link href="/auth/login" className="hover:text-slate-950">Giriş</Link>
                        <Link href="/auth/register" className="hover:text-slate-950">Kayıt ol</Link>
                        <a href={whatsappPremiumUrl} target="_blank" rel="noreferrer" className="hover:text-slate-950">İletişim</a>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">© 2026 {SITE_NAME}. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </main>
    );
}

function HeroDeviceShowcase() {
    return (
        <div className="landing-float relative min-h-[560px] sm:min-h-[620px] lg:min-h-[650px]">
            <div className="absolute bottom-0 right-1 w-[76%] min-w-[260px] max-w-[365px] rounded-[2.4rem] border-[12px] border-slate-950 bg-white shadow-2xl shadow-slate-950/25 sm:right-[8%] sm:w-[52%] lg:right-[12%] lg:max-w-[390px]">
                <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-slate-200" />
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-2xl font-black text-white">
                            M
                        </div>
                        <div className="min-w-0">
                            <p className="inline-flex rounded-full border border-orange-100 bg-white px-3 py-1 text-[10px] font-black text-orange-600 shadow-sm">
                                Dijital menu
                            </p>
                            <h3 className="mt-1 text-2xl font-black tracking-normal text-slate-950">myo</h3>
                            <p className="truncate text-xs font-semibold text-slate-500">{"Antalya'nin en iyi restorani!"}</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                        {["1 urun", "1 kategori", "Telefon", "Adres var"].map((item) => (
                            <div key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-black text-slate-700 shadow-sm">
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-400 shadow-sm">
                        Menude urun veya aciklama ara...
                    </div>

                    <div className="-mx-4 mt-6 border-y border-slate-200 bg-slate-50 px-4 py-4">
                        <span className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20">
                            Ana Yemek 1
                        </span>
                    </div>

                    <div className="mt-5">
                        <h4 className="text-2xl font-black tracking-normal text-slate-950">Ana Yemek</h4>
                        <p className="text-xs font-black text-slate-400">1 urun</p>
                        <div className="mt-4 flex items-center gap-4 rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-lg shadow-slate-950/10">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-100 to-emerald-100" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-base font-black text-slate-950">Karisik Pizza</p>
                                <p className="mt-1 truncate text-xs font-semibold text-slate-500">Testtselll</p>
                                <p className="mt-2 text-sm font-black text-orange-600">₺280,00</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-slate-300" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[10px] font-black">
                    <span className="text-slate-400">myo</span>
                    <span className="text-slate-400">Powered by <span className="text-orange-600">vexorabyte</span></span>
                </div>
            </div>
        </div>
    );
}
