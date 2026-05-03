'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getCategories() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor', categories: [] };
    }

    // Get restaurant
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        return { error: 'Restoran bulunamadı', categories: [] };
    }

    // Get categories with product count
    const { data: categories, error } = await supabase
        .from('categories')
        .select(`
      *,
      products:products(count)
    `)
        .eq('restaurant_id', restaurant.id)
        .order('sort_order', { ascending: true });

    if (error) {
        return { error: error.message, categories: [] };
    }

    // Transform to include product count
    const categoriesWithCount = categories?.map(cat => ({
        ...cat,
        product_count: cat.products?.[0]?.count || 0
    })) || [];

    return { categories: categoriesWithCount, restaurantId: restaurant.id };
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const name = formData.get('name') as string;
    const restaurantId = formData.get('restaurant_id') as string;

    // Get max sort order
    const { data: maxOrderResult } = await supabase
        .from('categories')
        .select('sort_order')
        .eq('restaurant_id', restaurantId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrderResult?.sort_order || 0) + 1;

    const { data, error } = await supabase
        .from('categories')
        .insert({
            name,
            restaurant_id: restaurantId,
            sort_order: nextOrder,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/kategoriler');
    return { success: true, category: data };
}

export async function updateCategory(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/kategoriler');
    return { success: true };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/kategoriler');
    return { success: true };
}

export async function reorderCategories(orderedIds: string[]) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const updates = orderedIds.map((id, index) =>
        supabase
            .from('categories')
            .update({ sort_order: index + 1 })
            .eq('id', id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) {
        return { error: failed.error.message };
    }

    revalidatePath('/kategoriler');
    return { success: true };
}
