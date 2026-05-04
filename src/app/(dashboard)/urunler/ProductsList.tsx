"use client";

import {
    AlertCircle,
    ArrowRight,
    BadgeTurkishLira,
    Edit,
    Filter,
    ImagePlus,
    Loader2,
    Package,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { createProduct, deleteProduct, updateProduct } from "./actions";

const DEFAULT_PRODUCT_IMAGE = "/defaults/menu-item.svg";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    view_count?: number | null;
    categories: Category | null;
}

interface ProductsListProps {
    initialProducts: Product[];
    categories: Category[];
    restaurantId: string;
}

export function ProductsList({ initialProducts, categories, restaurantId }: ProductsListProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || product.categories?.id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const uncategorizedCount = products.filter((product) => !product.categories).length;
    const missingDescriptionCount = products.filter((product) => !product.description?.trim()).length;
    const averagePrice = useMemo(() => {
        if (products.length === 0) return 0;
        return products.reduce((total, product) => total + Number(product.price || 0), 0) / products.length;
    }, [products]);

    async function handleCreate(formData: FormData) {
        setError(null);
        formData.set("restaurant_id", restaurantId);

        startTransition(async () => {
            const result = await createProduct(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.product) {
                setProducts((prev) => [result.product!, ...prev]);
                setShowAddModal(false);
            }
        });
    }

    async function handleUpdate(formData: FormData) {
        if (!selectedProduct) return;
        setError(null);
        formData.set("id", selectedProduct.id);

        startTransition(async () => {
            const result = await updateProduct(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.product) {
                setProducts((prev) =>
                    prev.map((product) => (product.id === selectedProduct.id ? result.product! : product))
                );
                setShowEditModal(false);
                setSelectedProduct(null);
            }
        });
    }

    async function handleDelete() {
        if (!selectedProduct) return;
        setError(null);

        startTransition(async () => {
            const result = await deleteProduct(selectedProduct.id);
            if (result.error) {
                setError(result.error);
            } else {
                setProducts((prev) => prev.filter((product) => product.id !== selectedProduct.id));
                setShowDeleteModal(false);
                setSelectedProduct(null);
            }
        });
    }

    function openAddModal() {
        setError(null);
        setShowAddModal(true);
    }

    function openEditModal(product: Product) {
        setError(null);
        setSelectedProduct(product);
        setShowEditModal(true);
    }

    function openDeleteModal(product: Product) {
        setError(null);
        setSelectedProduct(product);
        setShowDeleteModal(true);
    }

    function formatPrice(value: number) {
        return new Intl.NumberFormat("tr-TR", {
            style: "currency",
            currency: "TRY",
            maximumFractionDigits: 2,
        }).format(Number(value || 0));
    }

    return (
        <>
            <div className="flex-1 space-y-6 p-4 sm:p-6">
                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    </div>
                )}

                <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                    <Package className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Menü ürünleri</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/45">
                                    Müşterinin gördüğü ürün adı, fiyat, kategori ve açıklamaları buradan yönetin. Net açıklamalar ve doğru kategoriler sipariş kararını kolaylaştırır.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-orange-500/20"
                            >
                                <Plus className="h-4 w-4" />
                                Yeni ürün
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-4">
                            <StatCard label="Toplam ürün" value={products.length.toString()} />
                            <StatCard label="Kategori" value={categories.length.toString()} />
                            <StatCard label="Kategorisiz" value={uncategorizedCount.toString()} />
                            <StatCard label="Ortalama fiyat" value={formatPrice(averagePrice)} />
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-500/15 dark:from-orange-500/10 dark:to-amber-500/5">
                        <div className="flex items-start gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm dark:bg-white/10">
                                <ImagePlus className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Ürün ipucu</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/55">
                                    Ürün adı kısa, açıklama iştah açıcı, fiyat net olmalı. Fotoğraf yükleme kapalı olduğu için açıklama daha da önemli.
                                </p>
                            </div>
                        </div>
                    </aside>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/[0.03] sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Ürün adı veya açıklama ara..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={filterCategory}
                                    onChange={(event) => setFilterCategory(event.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                >
                                    <option value="all">Tüm kategoriler</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-500 dark:text-white/40">
                            {filteredProducts.length} ürün gösteriliyor
                            {missingDescriptionCount > 0 ? `, ${missingDescriptionCount} açıklama eksik` : ""}
                        </div>
                    </div>
                </section>

                {filteredProducts.length > 0 ? (
                    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                formatPrice={formatPrice}
                                onEdit={() => openEditModal(product)}
                                onDelete={() => openDeleteModal(product)}
                            />
                        ))}
                    </section>
                ) : (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                            <Package className="h-8 w-8" />
                        </div>
                        <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">
                            {searchTerm || filterCategory !== "all" ? "Sonuç bulunamadı" : "Henüz ürün yok"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/40">
                            {searchTerm || filterCategory !== "all"
                                ? "Arama veya kategori filtresini değiştirerek tekrar deneyin."
                                : "Menünüzü müşteriye göstermek için ilk ürününüzü ekleyin."}
                        </p>
                        {!searchTerm && filterCategory === "all" && (
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white"
                            >
                                <Plus className="h-4 w-4" />
                                İlk ürünü ekle
                            </button>
                        )}
                    </section>
                )}
            </div>

            <ProductModal
                mode="create"
                open={showAddModal}
                pending={isPending}
                error={error}
                categories={categories}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreate}
            />

            <ProductModal
                mode="edit"
                open={showEditModal && Boolean(selectedProduct)}
                pending={isPending}
                error={error}
                categories={categories}
                product={selectedProduct}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleUpdate}
            />

            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18181f]">
                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10">
                            <Trash2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-center text-lg font-black text-slate-950 dark:text-white">Ürün silinecek</h3>
                        <p className="mt-2 text-center text-sm leading-6 text-slate-500 dark:text-white/45">
                            <strong className="font-black text-slate-800 dark:text-white">{selectedProduct.name}</strong> ürününü silmek istediğinize emin misiniz?
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedProduct(null);
                                }}
                                className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-white/5 dark:text-white/70"
                            >
                                Vazgeç
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isPending}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
        </div>
    );
}

function ProductCard({
    product,
    formatPrice,
    onEdit,
    onDelete,
}: {
    product: Product;
    formatPrice: (value: number) => string;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const imageUrl = product.image_url && product.image_url.trim() !== "" ? product.image_url : DEFAULT_PRODUCT_IMAGE;

    return (
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.03]">
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-white/[0.04]">
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url("${imageUrl}")` }} aria-label={product.name} />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-white">
                    {product.categories?.name || "Kategorisiz"}
                </div>
                <div className="absolute right-3 top-3 flex gap-1">
                    <button
                        type="button"
                        onClick={onEdit}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-orange-600 dark:bg-slate-950/80 dark:text-white/70"
                        title="Düzenle"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-red-500 dark:bg-slate-950/80 dark:text-white/70"
                        title="Sil"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-950 dark:text-white">{product.name}</h3>
                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-white/40">
                            {product.description || "Açıklama eklenmemiş. Müşterinin karar vermesi için kısa bir açıklama ekleyin."}
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                    <span className="inline-flex items-center gap-2 text-sm font-black text-orange-600">
                        <BadgeTurkishLira className="h-4 w-4" />
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{product.view_count || 0} görüntülenme</span>
                </div>
            </div>
        </article>
    );
}

function ProductModal({
    mode,
    open,
    pending,
    error,
    categories,
    product,
    onClose,
    onSubmit,
}: {
    mode: "create" | "edit";
    open: boolean;
    pending: boolean;
    error: string | null;
    categories: Category[];
    product?: Product | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}) {
    if (!open) return null;

    const isCreate = mode === "create";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18181f]">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-black text-slate-950 dark:text-white">
                            {isCreate ? "Yeni ürün" : "Ürünü düzenle"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
                            {isCreate ? "Menünüze yeni bir ürün ekleyin." : "Ürün adı, açıklama, fiyat veya kategoriyi güncelleyin."}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-white/10">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form action={onSubmit} className="space-y-5">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/45">
                        Ürün görsel yükleme bu sürümde kapalı. Panel ve menüde varsayılan ürün görseli kullanılır.
                    </div>

                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 dark:text-white/70">Ürün adı</span>
                        <input
                            type="text"
                            name="name"
                            required
                            defaultValue={product?.name || ""}
                            placeholder="Örn: Karışık Pizza"
                            disabled={pending}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 dark:text-white/70">Açıklama</span>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={product?.description || ""}
                            placeholder="Örn: Mozzarella, sucuk, mantar ve özel domates sosu."
                            disabled={pending}
                            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-white/70">Fiyat</span>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                defaultValue={product?.price || ""}
                                placeholder="0.00"
                                disabled={pending}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-white/70">Kategori</span>
                            <select
                                name="category_id"
                                defaultValue={product?.categories?.id || ""}
                                disabled={pending}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                            >
                                <option value="">Kategori seç</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {categories.length === 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                            Henüz kategori yok. Ürünü kategorisiz ekleyebilir veya önce Kategoriler sayfasından kategori oluşturabilirsiniz.
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-white/5 dark:text-white/70"
                        >
                            Vazgeç
                        </button>
                        <button
                            type="submit"
                            disabled={pending}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
                        >
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : isCreate ? <Plus className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                            {pending ? "Kaydediliyor..." : isCreate ? "Ekle" : "Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
