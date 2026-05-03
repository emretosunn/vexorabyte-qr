"use client";
// Touched to fix import error

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Phone, Clock, ChevronDown, X, ShoppingBag, Star } from "lucide-react";
import { type RestaurantMenuData, incrementRestaurantView } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { SITE_NAME } from "@/lib/site";

interface MenuPageProps {
    data: RestaurantMenuData;
}

const DEFAULT_PRODUCT_IMAGE_URL = "/defaults/menu-item.svg";

export function MenuClient({ data }: MenuPageProps) {
    const { restaurant, categories } = data;
    const supabaseRef = useRef(createClient());
    const [restaurantState, setRestaurantState] = useState(restaurant);
    const [categoriesState, setCategoriesState] = useState(categories);
    const [activeCategory, setActiveCategory] = useState<string | null>(
        categories[0]?.id || null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        image_url: string | null;
    } | null>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Increment view count on mount
    const viewIncremented = useRef(false);
    useEffect(() => {
        if (!viewIncremented.current) {
            incrementRestaurantView(restaurant.id);
            viewIncremented.current = true;
        }
    }, [restaurant.id]);

    // Theme color from restaurant or default
    const themeColor = restaurantState.theme_color || "#f97316";

    // Filter products by search
    const filteredCategories = categoriesState.map(cat => ({
        ...cat,
        products: cat.products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.products.length > 0 || !searchTerm);

    // Get all products count
    const totalProducts = categoriesState.reduce((acc, cat) => acc + cat.products.length, 0);

    useEffect(() => {
        if (searchTerm) return;
        const categoryIds = categoriesState.map((category) => category.id);
        if (categoryIds.length === 0) return;

        const onScroll = () => {
            const offset = 160;
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

        const refreshMenu = async () => {
            const [{ data: latestRestaurant }, { data: latestCategories }] = await Promise.all([
                supabaseRef.current
                    .from("restaurants")
                    .select("id, name, description, slug, logo_url")
                    .eq("id", restaurant.id)
                    .maybeSingle(),
                supabaseRef.current
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

        const channel = supabaseRef.current
            .channel(`restaurant-menu-${restaurant.id}`)
            .on("postgres_changes", { event: "*", schema: "public", table: "restaurants", filter: `id=eq.${restaurant.id}` }, refreshMenu)
            .on("postgres_changes", { event: "*", schema: "public", table: "categories", filter: `restaurant_id=eq.${restaurant.id}` }, refreshMenu)
            .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `restaurant_id=eq.${restaurant.id}` }, refreshMenu)
            .subscribe();

        return () => {
            isMounted = false;
            supabaseRef.current.removeChannel(channel);
        };
    }, [restaurant.id]);

    function scrollToCategory(categoryId: string) {
        setActiveCategory(categoryId);
        const section = sectionRefs.current[categoryId];
        if (!section) return;

        const y = section.getBoundingClientRect().top + window.scrollY - 130;
        window.scrollTo({ top: y, behavior: "smooth" });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0a0a0f] dark:to-[#12121a]">
            {/* Hero Header */}
            <header
                className="relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}05 100%)`
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${themeColor} 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-12">
                    {/* Logo & Restaurant Info */}
                    <div className="flex flex-col items-center text-center">
                        {restaurantState.logo_url ? (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg mb-4 ring-4 ring-white/50 dark:ring-white/10">
                                <img
                                    src={restaurantState.logo_url}
                                    alt={restaurantState.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-lg mb-4 flex items-center justify-center text-white text-3xl font-bold"
                                style={{ backgroundColor: themeColor }}
                            >
                                {restaurantState.name.charAt(0)}
                            </div>
                        )}

                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {restaurantState.name}
                        </h1>

                        {restaurantState.description && (
                            <p className="text-slate-600 dark:text-white/60 text-sm sm:text-base max-w-md">
                                {restaurantState.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 dark:text-white/40">
                            <span className="flex items-center gap-1.5">
                                <ShoppingBag className="w-4 h-4" />
                                {totalProducts} Ürün
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                {categories.length} Kategori
                            </span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Menüde ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 shadow-sm"
                                style={{ '--tw-ring-color': `${themeColor}40` } as React.CSSProperties}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Category Tabs */}
            {categoriesState.length > 0 && !searchTerm && (
                <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#12121a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
                            {categoriesState.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => scrollToCategory(category.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category.id
                                        ? 'text-white shadow-lg'
                                        : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                    style={activeCategory === category.id ? { backgroundColor: themeColor } : {}}
                                >
                                    {category.name}
                                    <span className="ml-1.5 text-xs opacity-70">
                                        ({category.products.length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Content */}
            <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
                {searchTerm ? (
                    // Search Results
                    <div className="space-y-6">
                        <p className="text-sm text-slate-500 dark:text-white/40">
                            &quot;{searchTerm}&quot; için {filteredCategories.reduce((acc, cat) => acc + cat.products.length, 0)} sonuç
                        </p>
                        {filteredCategories.map((category) => (
                            <div key={category.id}>
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-3">
                                    {category.name}
                                </h3>
                                <div className="grid gap-3">
                                    {category.products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            themeColor={themeColor}
                                            onClick={() => setSelectedProduct(product)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Category View (all categories visible)
                    <div className="space-y-8">
                        {categoriesState.map((category) => (
                            <div
                                key={category.id}
                                ref={(el) => {
                                    sectionRefs.current[category.id] = el;
                                }}
                                id={`category-${category.id}`}
                                className="scroll-mt-32"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {category.name}
                                    </h2>
                                    <span className="text-sm text-slate-400 dark:text-white/30">
                                        {category.products.length} ürün
                                    </span>
                                </div>

                                {category.products.length > 0 ? (
                                    <div className="grid gap-3">
                                        {category.products.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                themeColor={themeColor}
                                                onClick={() => setSelectedProduct(product)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 dark:text-white/10 mb-3" />
                                        <p className="text-slate-500 dark:text-white/40">
                                            Bu kategoride henüz ürün yok
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {categoriesState.length === 0 && (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 dark:text-white/10 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            Menü Hazırlanıyor
                        </h3>
                        <p className="text-slate-500 dark:text-white/40">
                            Bu restoranın menüsü henüz eklenmemiş
                        </p>
                    </div>
                )}
            </main>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedProduct(null)}
                    />
                    <div className="relative w-full sm:max-w-lg bg-white dark:bg-[#18181f] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden">
                        {/* Product Image */}
                        {(selectedProduct.image_url || DEFAULT_PRODUCT_IMAGE_URL) && (
                            <div className="aspect-video bg-slate-100 dark:bg-white/5">
                                <img
                                    src={selectedProduct.image_url || DEFAULT_PRODUCT_IMAGE_URL}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-black/50 text-slate-600 dark:text-white hover:bg-white dark:hover:bg-black/70 transition-colors shadow-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {selectedProduct.name}
                                </h3>
                                <span
                                    className="text-xl font-bold shrink-0"
                                    style={{ color: themeColor }}
                                >
                                    ₺{selectedProduct.price.toFixed(2)}
                                </span>
                            </div>

                            {selectedProduct.description && (
                                <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed">
                                    {selectedProduct.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#12121a]/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 py-3">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-xs text-slate-400 dark:text-white/30">
                        Powered by <span className="font-semibold" style={{ color: themeColor }}>{SITE_NAME}</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Product Card Component
function ProductCard({
    product,
    themeColor,
    onClick
}: {
    product: { id: string; name: string; description: string | null; price: number; image_url: string | null };
    themeColor: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-md transition-all text-left group"
        >
            {/* Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 dark:bg-white/5 overflow-hidden shrink-0">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <img
                        src={DEFAULT_PRODUCT_IMAGE_URL}
                        alt="Varsayılan ürün görseli"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-slate-900 dark:text-white truncate">
                    {product.name}
                </h4>
                {product.description && (
                    <p className="text-[13px] text-slate-500 dark:text-white/40 line-clamp-2 mt-1">
                        {product.description}
                    </p>
                )}
                <p
                    className="text-[15px] font-bold mt-2"
                    style={{ color: themeColor }}
                >
                    ₺{product.price.toFixed(2)}
                </p>
            </div>

            {/* Arrow */}
            <ChevronDown className="w-5 h-5 text-slate-300 dark:text-white/20 -rotate-90 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
    );
}
