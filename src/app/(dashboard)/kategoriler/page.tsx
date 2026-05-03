import { Plus, FolderOpen } from "lucide-react";
import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesList } from "./CategoriesList";

async function getCategoriesData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        redirect('/onboarding');
    }

    const { data: categories } = await supabase
        .from('categories')
        .select(`
      *,
      products:products(count)
    `)
        .eq('restaurant_id', restaurant.id)
        .order('sort_order', { ascending: true });

    const categoriesWithCount = categories?.map(cat => ({
        ...cat,
        product_count: cat.products?.[0]?.count || 0
    })) || [];

    return { categories: categoriesWithCount, restaurantId: restaurant.id };
}

export default async function KategorilerPage() {
    const { categories, restaurantId } = await getCategoriesData();

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Kategoriler" description="Menü kategorilerinizi yönetin" />
            <CategoriesList initialCategories={categories} restaurantId={restaurantId} />
        </div>
    );
}
