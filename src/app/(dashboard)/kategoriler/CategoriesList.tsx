"use client";

import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Edit,
    FolderOpen,
    GripVertical,
    Layers3,
    Loader2,
    Plus,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { createCategory, deleteCategory, reorderCategories, updateCategory } from "./actions";

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

    const totalProducts = useMemo(
        () => categories.reduce((total, category) => total + category.product_count, 0),
        [categories]
    );
    const emptyCategories = categories.filter((category) => category.product_count === 0).length;

    async function handleCreate(formData: FormData) {
        setError(null);
        formData.set("restaurant_id", restaurantId);

        startTransition(async () => {
            const result = await createCategory(formData);
            if (result.error) {
                setError(result.error);
            } else if (result.category) {
                setCategories((prev) => [...prev, { ...result.category, product_count: 0 }]);
                setShowAddModal(false);
            }
        });
    }

    async function handleUpdate(formData: FormData) {
        if (!selectedCategory) return;
        setError(null);
        formData.set("id", selectedCategory.id);

        startTransition(async () => {
            const result = await updateCategory(formData);
            if (result.error) {
                setError(result.error);
            } else {
                const newName = formData.get("name") as string;
                setCategories((prev) =>
                    prev.map((category) =>
                        category.id === selectedCategory.id ? { ...category, name: newName } : category
                    )
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
                setCategories((prev) => prev.filter((category) => category.id !== selectedCategory.id));
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

    function openEditModal(category: Category) {
        setError(null);
        setSelectedCategory(category);
        setShowEditModal(true);
    }

    function openDeleteModal(category: Category) {
        setError(null);
        setSelectedCategory(category);
        setShowDeleteModal(true);
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
                                    <Layers3 className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-950 dark:text-white">Menü kategorileri</h2>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-white/45">
                                    Kategoriler müşterinin menüde hızlı gezmesini sağlar. Sıra neyse public menüde de aynı sırayla görünür.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setError(null);
                                    setShowAddModal(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-black text-white shadow-xl shadow-orange-500/20"
                            >
                                <Plus className="h-4 w-4" />
                                Yeni kategori
                            </button>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Kategori</p>
                                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{categories.length}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Ürün</p>
                                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{totalProducts}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Boş kategori</p>
                                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{emptyCategories}</p>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-sm dark:border-orange-500/15 dark:from-orange-500/10 dark:to-amber-500/5">
                        <div className="flex items-start gap-4">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-orange-600 shadow-sm dark:bg-white/10">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">İyi menü sırası</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-white/55">
                                    En çok satmak istediğiniz bölümleri yukarı alın. İçecek ve tatlıları ayrı kategori yapmak müşteriye kolaylık sağlar.
                                </p>
                            </div>
                        </div>
                    </aside>
                </section>

                {categories.length > 0 ? (
                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/[0.03] sm:p-6">
                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-black text-slate-950 dark:text-white">Kategori sırası</h3>
                                <p className="text-sm text-slate-500 dark:text-white/40">
                                    Tutup sürükleyin veya oklarla taşıyın. Değişiklik otomatik kaydedilir.
                                </p>
                            </div>
                            {isPending && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Kaydediliyor
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
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
                                    className={`group rounded-2xl border bg-slate-50 p-4 transition-all dark:bg-white/[0.03] ${
                                        dragOverCategoryId === category.id
                                            ? "border-orange-400 ring-4 ring-orange-200/60 dark:ring-orange-500/20"
                                            : "border-slate-200 hover:border-orange-200 dark:border-white/5"
                                    }`}
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex min-w-0 items-center gap-3">
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
                                                className="grid h-10 w-10 shrink-0 cursor-grab place-items-center rounded-xl bg-white text-slate-400 shadow-sm active:cursor-grabbing dark:bg-white/10"
                                                title="Sürükleyerek sırala"
                                            >
                                                <GripVertical className="h-4 w-4" />
                                            </button>
                                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                                                <FolderOpen className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="truncate text-base font-black text-slate-950 dark:text-white">{category.name}</h4>
                                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 shadow-sm dark:bg-white/10 dark:text-white/45">
                                                        Sıra {index + 1}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
                                                    {category.product_count} ürün bu kategoride listeleniyor.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 self-end sm:self-auto">
                                            <button
                                                type="button"
                                                onClick={() => moveCategory(index, "up")}
                                                disabled={isPending || index === 0}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white/10 dark:text-white/45"
                                                title="Yukarı taşı"
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveCategory(index, "down")}
                                                disabled={isPending || index === categories.length - 1}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white/10 dark:text-white/45"
                                                title="Aşağı taşı"
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(category)}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition-colors hover:text-orange-600 dark:bg-white/10 dark:text-white/45"
                                                title="Düzenle"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(category)}
                                                className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-500 shadow-sm transition-colors hover:text-red-500 dark:bg-white/10 dark:text-white/45"
                                                title="Sil"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                            <FolderOpen className="h-8 w-8" />
                        </div>
                        <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">Henüz kategori yok</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/40">
                            Menünüzü bölümlere ayırmak için ilk kategorinizi oluşturun. Örneğin: Kahvaltı, Ana Yemekler, İçecekler, Tatlılar.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white"
                        >
                            <Plus className="h-4 w-4" />
                            İlk kategoriyi ekle
                        </button>
                    </section>
                )}
            </div>

            <CategoryModal
                mode="create"
                open={showAddModal}
                pending={isPending}
                error={error}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleCreate}
            />

            <CategoryModal
                mode="edit"
                open={showEditModal && Boolean(selectedCategory)}
                pending={isPending}
                error={error}
                initialName={selectedCategory?.name}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                }}
                onSubmit={handleUpdate}
            />

            {showDeleteModal && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18181f]">
                        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10">
                            <Trash2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-center text-lg font-black text-slate-950 dark:text-white">Kategori silinecek</h3>
                        <p className="mt-2 text-center text-sm leading-6 text-slate-500 dark:text-white/45">
                            <strong className="font-black text-slate-800 dark:text-white">{selectedCategory.name}</strong> kategorisini silmek istediğinize emin misiniz?
                            {selectedCategory.product_count > 0 && (
                                <span className="mt-2 block text-red-500">
                                    Bu kategoride {selectedCategory.product_count} ürün bulunuyor.
                                </span>
                            )}
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCategory(null);
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

function CategoryModal({
    mode,
    open,
    pending,
    error,
    initialName,
    onClose,
    onSubmit,
}: {
    mode: "create" | "edit";
    open: boolean;
    pending: boolean;
    error: string | null;
    initialName?: string;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}) {
    if (!open) return null;

    const isCreate = mode === "create";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#18181f]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-slate-950 dark:text-white">
                            {isCreate ? "Yeni kategori" : "Kategoriyi düzenle"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
                            {isCreate ? "Menünüzde yeni bir bölüm oluşturun." : "Kategori adını müşterinin anlayacağı şekilde güncelleyin."}
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

                <form action={onSubmit}>
                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 dark:text-white/70">Kategori adı</span>
                        <input
                            type="text"
                            name="name"
                            required
                            defaultValue={initialName || ""}
                            placeholder="Örn: Ana Yemekler"
                            disabled={pending}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </label>
                    <div className="mt-6 flex gap-3">
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
                            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            {isCreate ? "Ekle" : "Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
