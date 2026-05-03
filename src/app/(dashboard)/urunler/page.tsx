import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsList } from "./ProductsList";

async function getProductsData() {
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

    const [productsResult, categoriesResult] = await Promise.all([
        supabase
            .from('products')
            .select(`
        *,
        categories:category_id(id, name)
      `)
            .eq('restaurant_id', restaurant.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('categories')
            .select('id, name')
            .eq('restaurant_id', restaurant.id)
            .order('sort_order', { ascending: true })
    ]);

    return {
        products: productsResult.data || [],
        categories: categoriesResult.data || [],
        restaurantId: restaurant.id
    };
}

export default async function UrunlerPage() {
    const { products, categories, restaurantId } = await getProductsData();

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Ürünler" description="Menü ürünlerinizi yönetin" />
            <ProductsList
                initialProducts={products}
                categories={categories}
                restaurantId={restaurantId}
            />
        </div>
    );
}
