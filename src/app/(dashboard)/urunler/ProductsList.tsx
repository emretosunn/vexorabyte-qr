"use client";

import { Plus, Package, Search, Trash2, Edit, X, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createProduct, updateProduct, deleteProduct } from "./actions";

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
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Filtered products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || product.categories?.id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    async function handleCreate(formData: FormData) {
        setError(null);
        formData.set('restaurant_id', restaurantId);

        startTransition(async () => {
            const result = await createProduct(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.product) {
                setProducts(prev => [result.product!, ...prev]);
                setShowAddModal(false);
            }
        });
    }

    async function handleUpdate(formData: FormData) {
        if (!selectedProduct) return;
        setError(null);
        formData.set('id', selectedProduct.id);

        startTransition(async () => {
            const result = await updateProduct(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.product) {
                setProducts(prev =>
                    prev.map(p => p.id === selectedProduct.id ? result.product! : p)
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
                setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
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

    function productImageSrc(imageUrl: string | null) {
        return imageUrl && imageUrl.trim() !== "" ? imageUrl : DEFAULT_PRODUCT_IMAGE;
    }

    return (
        <>
            <div className="flex-1 p-6 space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
                            <input
                                type="text"
                                placeholder="Ürün ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[13px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all"
                            />
                        </div>
                        {/* Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all"
                        >
                            <option value="all">Tüm Kategoriler</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Ürün
                    </button>
                </div>

                {/* Stats */}
                <p className="text-[13px] text-slate-500 dark:text-white/40">
                    {filteredProducts.length} ürün gösteriliyor
                </p>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group relative rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:shadow-lg overflow-hidden transition-all"
                            >
                                {/* Image */}
                                <div className="aspect-[4/3] bg-slate-100 dark:bg-gradient-to-br dark:from-white/[0.02] dark:to-white/[0.05] flex items-center justify-center relative overflow-hidden">
                                    <img
                                        src={productImageSrc(product.image_url)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Action buttons on hover */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg text-slate-500 dark:text-white/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-[12px] text-slate-500 dark:text-white/30 mt-1 line-clamp-2">
                                                {product.description || "Açıklama yok"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                        <span className="text-[11px] text-slate-500 dark:text-white/30 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5">
                                            {product.categories?.name || "Kategorisiz"}
                                        </span>
                                        <span className="text-[16px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                            ₺{product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 mb-4">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                            {searchTerm || filterCategory !== "all" ? "Sonuç bulunamadı" : "Henüz ürün yok"}
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-white/40 mb-4 max-w-sm">
                            {searchTerm || filterCategory !== "all"
                                ? "Arama kriterlerinize uygun ürün bulunamadı"
                                : "Menünüze ürünler ekleyerek başlayın"
                            }
                        </p>
                        {!searchTerm && filterCategory === "all" && (
                            <button
                                onClick={openAddModal}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-4 h-4" />
                                İlk Ürünü Ekle
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">Yeni Ürün</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                                {error}
                            </div>
                        )}

                        <form action={handleCreate} className="space-y-4">
                            <p className="text-[13px] text-slate-500 dark:text-white/40 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3">
                                Ürün görselleri bu sürümde sabittir (özel fotoğraf yüklenmez). Menü ve panelde ortak varsayılan görsel kullanılır.
                            </p>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Ürün Adı *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Örn: Karışık Pizza"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Ürün açıklaması..."
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all resize-none disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Fiyat (₺) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="category_id"
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                    >
                                        <option value="">Kategori Seç</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Ekle
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowEditModal(false); setSelectedProduct(null); }} />
                    <div className="relative w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">Ürün Düzenle</h3>
                            <button onClick={() => { setShowEditModal(false); setSelectedProduct(null); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                                {error}
                            </div>
                        )}

                        <form action={handleUpdate} className="space-y-4">
                            <div className="aspect-video rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-white/5">
                                <img
                                    src={productImageSrc(selectedProduct.image_url)}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-white/40">
                                Görsel değiştirilemez (varsayılan görsel kullanılıyor).
                            </p>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Ürün Adı *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={selectedProduct.name}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={selectedProduct.description || ""}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all resize-none disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Fiyat (₺) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        defaultValue={selectedProduct.price}
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="category_id"
                                        defaultValue={selectedProduct.categories?.id || ""}
                                        disabled={isPending}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                    >
                                        <option value="">Kategori Seç</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedProduct(null); }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : "Kaydet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteModal(false); setSelectedProduct(null); }} />
                    <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white text-center mb-2">
                            Ürün Silinecek
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-white/40 text-center mb-6">
                            <strong className="text-slate-700 dark:text-white">{selectedProduct.name}</strong> ürününü silmek istediğinize emin misiniz?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setSelectedProduct(null); }}
                                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
