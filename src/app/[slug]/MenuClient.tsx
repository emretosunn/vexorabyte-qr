"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronRight,
    Clock3,
    MapPin,
    PackageOpen,
    Phone,
    Search,
    ShoppingBag,
    Sparkles,
    Star,
    X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/site";
import { incrementRestaurantView, type RestaurantMenuData } from "./actions";

const DEFAULT_PRODUCT_IMAGE_URL = "/defaults/menu-item.svg";

interface MenuPageProps {
    data: RestaurantMenuData;
}

type MenuProduct = RestaurantMenuData["categories"][number]["products"][number];

export function MenuClient({ data }: MenuPageProps) {
    const { restaurant, categories } = data;
    const supabaseRef = useRef(createClient());
    const [restaurantState, setRestaurantState] = useState(restaurant);
    const [categoriesState, setCategoriesState] = useState(categories);
    const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id || null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const viewIncremented = useRef(false);

    const themeColor = restaurantState.theme_color || "#f97316";
    const totalProducts = categoriesState.reduce((acc, category) => acc + category.products.length, 0);
    const filteredCategories = useMemo(
        () =>
            categoriesState
                .map((category) => ({
                    ...category,
                    products: category.products.filter(
                        (product) =>
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    ),
                }))
                .filter((category) => category.products.length > 0 || !searchTerm),
        [categoriesState, searchTerm]
    );
    const filteredProductsCount = filteredCategories.reduce((acc, category) => acc + category.products.length, 0);

    useEffect(() => {
        if (!viewIncremented.current) {
            incrementRestaurantView(restaurant.id);
            viewIncremented.current = true;
        }
    }, [restaurant.id]);

    useEffect(() => {
        if (searchTerm) return;
        const categoryIds = categoriesState.map((category) => category.id);
        if (categoryIds.length === 0) return;

        const onScroll = () => {
            const offset = 132;
            let currentId = categoryIds[0];

            for (const id of categoryIds) {
                const section = sectionRefs.current[id];
                if (!section) continue;
                if (section.getBoundingClientRect().top - offset <= 0) {
                    currentId = id;
                } else {
                    break;
                }
            }

            setActiveCategory(currentId);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [categoriesState, searchTerm]);

    useEffect(() => {
        let isMounted = true;
        const supabase = supabaseRef.current;

        const refreshMenu = async () => {
            const [{ data: latestRestaurant }, { data: latestCategories }] = await Promise.all([
                supabase
                    .from("restaurants")
                    .select("id, name, description, slug, logo_url, phone, address")
                    .eq("id", restaurant.id)
                    .maybeSingle(),
                supabase
                    .from("categories")
                    .select(`
                        id,
                        name,
                        sort_order,
                        products!category_id (
                            id,
                            name,
                            description,
                            price,
                            image_url,
                            sort_order
                        )
                    `)
                    .eq("restaurant_id", restaurant.id)
                    .order("sort_order", { ascending: true }),
            ]);

            if (!isMounted) return;

            if (latestRestaurant) {
                setRestaurantState((prev) => ({ ...prev, ...latestRestaurant }));
            }

            if (latestCategories) {
                const normalized = latestCategories.map((category) => ({
                    ...category,
                    products: [...(category.products || [])].sort(
                        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                    ),
                }));
                setCategoriesState(normalized);
            }
        };

        const channel = supabase
            .channel(`restaurant-menu-${restaurant.id}`)
            .on("postgres_changes", { event: "*", schema: "public", table: "restaurants", filter: `id=eq.${restaurant.id}` }, refreshMenu)
            .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter: `restaurant_id=eq.${restaurant.id}` }, refreshMenu)
            .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `restaurant_id=eq.${restaurant.id}` }, refreshMenu)
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [restaurant.id]);

    function scrollToCategory(categoryId: string) {
        setActiveCategory(categoryId);
        const section = sectionRefs.current[categoryId];
        if (!section) return;

        const y = section.getBoundingClientRect().top + window.scrollY - 118;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    function formatPrice(value: number) {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            maximumFractionDigits: 2,
        }).format(Number(value || 0));
    }

    return (
        <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
            <header className="relative overflow-hidden bg-white">
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        background: `radial-gradient(circle at 24% 8%, ${themeColor}24, transparent 30%), linear-gradient(135deg, ${themeColor}18 0%, #ffffff 48%, #f8fafc 100%)`,
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${themeColor} 1px, transparent 0)`,
                        backgroundSize: "26px 26px",
                    }}
                />

                <div className="relative mx-auto max-w-5xl px-4 pb-7 pt-7 sm:px-6 sm:pb-10 sm:pt-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="flex items-center gap-4 md:items-end">
                            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[1.6rem] bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 sm:h-24 sm:w-24">
                                {restaurantState.logo_url ? (
                                    <div
                                        className="h-full w-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${restaurantState.logo_url}")` }}
                                        aria-label={restaurantState.name}
                                    />
                                ) : (
                                    <div
                                        className="grid h-full w-full place-items-center text-3xl font-black text-white sm:text-4xl"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {restaurantState.name.charAt(0).toLocaleUpperCase("tr-TR")}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-600 shadow-sm ring-1 ring-slate-900/5">
                                    <Sparkles className="h-3.5 w-3.5" style={{ color: themeColor }} />
                                    Dijital menü
                                </div>
                                <h1 className="truncate text-3xl font-black tracking-normal text-slate-950 sm:text-5xl">
                                    {restaurantState.name}
                                </h1>
                                {restaurantState.description && (
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                                        {restaurantState.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                            <InfoPill icon={ShoppingBag} label={`${totalProducts} ürün`} />
                            <InfoPill icon={Star} label={`${categoriesState.length} kategori`} />
                            {restaurantState.phone && <InfoPill icon={Phone} label="Telefon" href={`tel:${restaurantState.phone}`} />}
                            {restaurantState.address && <InfoPill icon={MapPin} label="Adres var" />}
                        </div>
                    </div>

                    <div className="mt-7 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Menüde ürün veya açıklama ara..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-base font-semibold text-slate-900 shadow-xl shadow-slate-900/5 outline-none transition-all placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl bg-slate-100 text-slate-400"
                                    aria-label="Aramayı temizle"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="hidden rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-slate-500 shadow-sm ring-1 ring-slate-900/5 md:block">
                            <Clock3 className="mr-2 inline h-4 w-4" />
                            Anlık güncel
                        </div>
                    </div>
                </div>
            </header>

            {categoriesState.length > 0 && !searchTerm && (
                <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6">
                        <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {categoriesState.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => scrollToCategory(category.id)}
                                    className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition-all ${
                                        activeCategory === category.id
                                            ? "text-white shadow-lg shadow-orange-500/20"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                    style={activeCategory === category.id ? { backgroundColor: themeColor } : {}}
                                >
                                    {category.name}
                                    <span className="ml-1.5 opacity-70">{category.products.length}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            )}

            <main className="mx-auto max-w-5xl px-4 py-6 pb-28 sm:px-6 sm:py-8">
                {searchTerm ? (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold text-slate-500">
                                “{searchTerm}” için {filteredProductsCount} sonuç
                            </p>
                        </div>
                        {filteredCategories.map((category) => (
                            <CategorySection
                                key={category.id}
                                category={category}
                                themeColor={themeColor}
                                formatPrice={formatPrice}
                                onSelectProduct={setSelectedProduct}
                            />
                        ))}
                        {filteredProductsCount === 0 && <EmptyState title="Sonuç bulunamadı" text="Farklı bir ürün adı veya açıklama kelimesi deneyin." />}
                    </div>
                ) : categoriesState.length > 0 ? (
                    <div className="space-y-8">
                        {categoriesState.map((category) => (
                            <div
                                key={category.id}
                                ref={(element) => {
                                    sectionRefs.current[category.id] = element;
                                }}
                                className="scroll-mt-28"
                            >
                                <CategorySection
                                    category={category}
                                    themeColor={themeColor}
                                    formatPrice={formatPrice}
                                    onSelectProduct={setSelectedProduct}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState title="Menü hazırlanıyor" text="Bu işletme henüz kategori ve ürün eklememiş." />
                )}
            </main>

            {selectedProduct && (
                <ProductSheet
                    product={selectedProduct}
                    themeColor={themeColor}
                    formatPrice={formatPrice}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/92 py-3 backdrop-blur-xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 text-xs font-bold text-slate-400 sm:px-6">
                    <span>{restaurantState.name}</span>
                    <span>
                        Powered by <span style={{ color: themeColor }}>{SITE_NAME}</span>
                    </span>
                </div>
            </footer>
        </div>
    );
}

function InfoPill({
    icon: Icon,
    label,
    href,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href?: string;
}) {
    const content = (
        <>
            <Icon className="h-4 w-4" />
            {label}
        </>
    );

    if (href) {
        return (
            <a href={href} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/85 px-3 py-2 text-xs font-black text-slate-600 shadow-sm ring-1 ring-slate-900/5">
                {content}
            </a>
        );
    }

    return (
        <span className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/85 px-3 py-2 text-xs font-black text-slate-600 shadow-sm ring-1 ring-slate-900/5">
            {content}
        </span>
    );
}

function CategorySection({
    category,
    themeColor,
    formatPrice,
    onSelectProduct,
}: {
    category: RestaurantMenuData["categories"][number];
    themeColor: string;
    formatPrice: (value: number) => string;
    onSelectProduct: (product: MenuProduct) => void;
}) {
    return (
        <section>
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-950">{category.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-400">{category.products.length} ürün</p>
                </div>
            </div>

            {category.products.length > 0 ? (
                <div className="grid gap-3">
                    {category.products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            themeColor={themeColor}
                            formatPrice={formatPrice}
                            onClick={() => onSelectProduct(product)}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <PackageOpen className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-500">Bu kategoride henüz ürün yok.</p>
                </div>
            )}
        </section>
    );
}

function ProductCard({
    product,
    themeColor,
    formatPrice,
    onClick,
}: {
    product: MenuProduct;
    themeColor: string;
    formatPrice: (value: number) => string;
    onClick: () => void;
}) {
    const imageUrl = product.image_url && product.image_url.trim() !== "" ? product.image_url : DEFAULT_PRODUCT_IMAGE_URL;

    return (
        <button
            type="button"
            onClick={onClick}
            className="group grid w-full grid-cols-[92px_1fr_auto] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg sm:grid-cols-[112px_1fr_auto] sm:p-4"
        >
            <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
                <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                    aria-label={product.name}
                />
            </div>
            <div className="min-w-0">
                <h3 className="truncate text-base font-black text-slate-950 sm:text-lg">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                    {product.description || "Açıklama eklenmemiş."}
                </p>
                <p className="mt-3 text-base font-black" style={{ color: themeColor }}>
                    {formatPrice(product.price)}
                </p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1" />
        </button>
    );
}

function ProductSheet({
    product,
    themeColor,
    formatPrice,
    onClose,
}: {
    product: MenuProduct;
    themeColor: string;
    formatPrice: (value: number) => string;
    onClose: () => void;
}) {
    const imageUrl = product.image_url && product.image_url.trim() !== "" ? product.image_url : DEFAULT_PRODUCT_IMAGE_URL;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <button className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm" onClick={onClose} aria-label="Ürün detayını kapat" />
            <div className="relative max-h-[88vh] w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-lg sm:rounded-[2rem]">
                <div className="relative aspect-[4/3] bg-slate-100">
                    <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url("${imageUrl}")` }} aria-label={product.name} />
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur"
                        aria-label="Kapat"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-black text-slate-950">{product.name}</h3>
                        <span className="shrink-0 text-xl font-black" style={{ color: themeColor }}>
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                        {product.description || "Bu ürün için açıklama henüz eklenmemiş."}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <PackageOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-black text-slate-950">{title}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{text}</p>
        </div>
    );
}
