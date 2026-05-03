"use client";

import { Plus, FolderOpen, Trash2, Edit, X, Loader2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory, reorderCategories } from "./actions";

interface Category {
    id: string;
    name: string;
    sort_order: number;
    product_count: number;
}

interface CategoriesListProps {
    initialCategories: Category[];
    restaurantId: string;
}

export function CategoriesList({ initialCategories, restaurantId }: CategoriesListProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
    const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);

    async function handleCreate(formData: FormData) {
        setError(null);
        formData.set('restaurant_id', restaurantId);

        startTransition(async () => {
            const result = await createCategory(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.category) {
                setCategories(prev => [...prev, { ...result.category, product_count: 0 }]);
                setShowAddModal(false);
            }
        });
    }

    async function handleUpdate(formData: FormData) {
        if (!selectedCategory) return;
        setError(null);
        formData.set('id', selectedCategory.id);

        startTransition(async () => {
            const result = await updateCategory(formData);
            if (result.error) {
                setError(result.error);
            } else {
                const newName = formData.get('name') as string;
                setCategories(prev =>
                    prev.map(cat => cat.id === selectedCategory.id ? { ...cat, name: newName } : cat)
                );
                setShowEditModal(false);
                setSelectedCategory(null);
            }
        });
    }

    async function handleDelete() {
        if (!selectedCategory) return;
        setError(null);

        startTransition(async () => {
            const result = await deleteCategory(selectedCategory.id);
            if (result.error) {
                setError(result.error);
            } else {
                setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
                setShowDeleteModal(false);
                setSelectedCategory(null);
            }
        });
    }

    function persistCategoryOrder(updated: Category[]) {
        const prevCategories = categories;
        const withSortOrder = updated.map((category, idx) => ({
            ...category,
            sort_order: idx + 1,
        }));

        setCategories(withSortOrder);
        setError(null);

        startTransition(async () => {
            const result = await reorderCategories(withSortOrder.map((category) => category.id));
            if (result?.error) {
                setError(result.error);
                setCategories(prevCategories);
            }
        });
    }

    function moveCategory(index: number, direction: "up" | "down") {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= categories.length) return;

        const updated = [...categories];
        const [moved] = updated.splice(index, 1);
        updated.splice(newIndex, 0, moved);
        persistCategoryOrder(updated);
    }

    function moveCategoryByDrag(draggedId: string, targetId: string) {
        if (draggedId === targetId) return;

        const updated = [...categories];
        const fromIndex = updated.findIndex((category) => category.id === draggedId);
        const toIndex = updated.findIndex((category) => category.id === targetId);
        if (fromIndex === -1 || toIndex === -1) return;

        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        persistCategoryOrder(updated);
    }

    return (
        <>
            <div className="flex-1 p-6 space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            Menü Kategorileri
                        </h2>
                        <p className="text-slate-500 dark:text-white/40 mt-1 text-[14px]">
                            Toplam {categories.length} kategori
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni Kategori
                    </button>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="space-y-4 max-w-3xl">
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    if (draggingCategoryId && draggingCategoryId !== category.id) {
                                        setDragOverCategoryId(category.id);
                                    }
                                }}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    const draggedId = event.dataTransfer.getData("text/category-id") || draggingCategoryId;
                                    if (draggedId) {
                                        moveCategoryByDrag(draggedId, category.id);
                                    }
                                    setDraggingCategoryId(null);
                                    setDragOverCategoryId(null);
                                }}
                                className={`group relative p-4 rounded-2xl bg-white dark:bg-white/[0.02] border hover:shadow-lg dark:hover:bg-white/[0.04] transition-all ${dragOverCategoryId === category.id
                                    ? "border-orange-400 ring-2 ring-orange-200/70 dark:ring-orange-500/30"
                                    : "border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            draggable
                                            onDragStart={(event) => {
                                                setDraggingCategoryId(category.id);
                                                event.dataTransfer.setData("text/category-id", category.id);
                                                event.dataTransfer.effectAllowed = "move";
                                            }}
                                            onDragEnd={() => {
                                                setDraggingCategoryId(null);
                                                setDragOverCategoryId(null);
                                            }}
                                            className="p-2 rounded-lg text-slate-300 dark:text-white/20 hover:bg-slate-100 dark:hover:bg-white/10 cursor-grab active:cursor-grabbing"
                                            title="Sürükleyerek sırala"
                                        >
                                            <GripVertical className="w-4 h-4" />
                                        </button>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400">
                                            <FolderOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-slate-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                            <p className="text-[12px] text-slate-500 dark:text-white/30">
                                                {category.product_count} ürün
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Menu */}
                                    <div className="relative">
                                        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            <button
                                                onClick={() => moveCategory(index, "up")}
                                                disabled={isPending || index === 0}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                title="Yukarı taşı"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => moveCategory(index, "down")}
                                                disabled={isPending || index === categories.length - 1}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                title="Aşağı taşı"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setShowEditModal(true);
                                                }}
                                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 text-orange-500 dark:text-orange-400 mb-4">
                            <FolderOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white mb-2">
                            Henüz kategori yok
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-white/40 mb-4 max-w-sm">
                            Menünüzü düzenlemek için kategoriler oluşturun. Örneğin: Ana Yemekler, İçecekler, Tatlılar
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-4 h-4" />
                            İlk Kategoriyi Ekle
                        </button>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">Yeni Kategori</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                                {error}
                            </div>
                        )}

                        <form action={handleCreate}>
                            <div className="mb-6">
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Kategori Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Örn: Ana Yemekler"
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                />
                            </div>
                            <div className="flex gap-3">
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
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Ekle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowEditModal(false); setSelectedCategory(null); }} />
                    <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white">Kategori Düzenle</h3>
                            <button onClick={() => { setShowEditModal(false); setSelectedCategory(null); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
                                {error}
                            </div>
                        )}

                        <form action={handleUpdate}>
                            <div className="mb-6">
                                <label className="block text-[13px] font-medium text-slate-700 dark:text-white/70 mb-2">
                                    Kategori Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={selectedCategory.name}
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 dark:focus:border-orange-500/50 transition-all disabled:opacity-50"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedCategory(null); }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteModal(false); setSelectedCategory(null); }} />
                    <div className="relative w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#18181f] border border-slate-200 dark:border-white/10 shadow-2xl">
                        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/10">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-[17px] font-semibold text-slate-900 dark:text-white text-center mb-2">
                            Kategori Silinecek
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-white/40 text-center mb-6">
                            <strong className="text-slate-700 dark:text-white">{selectedCategory.name}</strong> kategorisini silmek istediğinize emin misiniz?
                            {selectedCategory.product_count > 0 && (
                                <span className="block mt-1 text-red-500 dark:text-red-400">
                                    Bu kategoride {selectedCategory.product_count} ürün bulunuyor!
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setSelectedCategory(null); }}
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
