import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesList } from "./CategoriesList";

async function getCategoriesData() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        redirect("/onboarding");
    }

    const { data: categories } = await supabase
        .from("categories")
        .select(`
            *,
            products:products(count)
        `)
        .eq("restaurant_id", restaurant.id)
        .order("sort_order", { ascending: true });

    const categoriesWithCount =
        categories?.map((category) => ({
            ...category,
            product_count: category.products?.[0]?.count || 0,
        })) || [];

    return { categories: categoriesWithCount, restaurantId: restaurant.id };
}

export default async function KategorilerPage() {
    const { categories, restaurantId } = await getCategoriesData();

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-[#0a0a0d]">
            <Header title="Kategoriler" description="Menünüzün bölümlerini ve sırasını yönetin" />
            <CategoriesList initialCategories={categories} restaurantId={restaurantId} />
        </div>
    );
}
