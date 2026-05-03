'use server';

import { createClient } from '@/lib/supabase/server';

export interface RestaurantMenuData {
    restaurant: {
        id: string;
        name: string;
        description: string | null;
        slug: string;
        logo_url: string | null;
        theme_color?: string | null;
    };
    categories: {
        id: string;
        name: string;
        sort_order: number;
        products: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            image_url: string | null;
            sort_order?: number;
        }[];
    }[];
}

export async function getRestaurantMenuBySlug(slug: string): Promise<{ data: RestaurantMenuData | null; error: string | null }> {
    const supabase = await createClient();

    const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id, name, description, slug, logo_url')
        .eq('slug', slug)
        .single();

    if (restaurantError || !restaurant) {
        return { data: null, error: 'Restoran bulunamadı' };
    }

    // Get categories with products
    const { data: categories, error: categoriesError } = await supabase
        .from('categories')
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
        .eq('restaurant_id', restaurant.id)
        .order('sort_order', { ascending: true });

    if (categoriesError) {
        return { data: null, error: 'Kategoriler yüklenemedi' };
    }

    return {
        data: {
            restaurant,
            categories: (categories || []).map((category) => ({
                ...category,
                products: [...(category.products || [])].sort(
                    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
                ),
            })),
        },
        error: null
    };
}

export async function incrementRestaurantView(restaurantId: string) {
    const supabase = await createClient();

    // First try RPC for atomicity
    const { error: rpcError } = await supabase.rpc('increment_restaurant_view', { restaurant_id: restaurantId });

    if (!rpcError) return;

    // Fallback to select + update if RPC doesn't exist
    const { data } = await supabase
        .from('restaurants')
        .select('view_count')
        .eq('id', restaurantId)
        .single();

    if (data) {
        await supabase
            .from('restaurants')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', restaurantId);
    }
}
