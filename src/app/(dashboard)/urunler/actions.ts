'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getProducts() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor', products: [], categories: [] };
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        return { error: 'Restoran bulunamadı', products: [], categories: [] };
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

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('category_id') as string;
    const restaurantId = formData.get('restaurant_id') as string;

    const { data, error } = await supabase
        .from('products')
        .insert({
            name,
            description,
            price,
            category_id: categoryId || null, // category_id is optional
            restaurant_id: restaurantId,
        })
        .select(`
      *,
      categories:category_id(id, name)
    `)
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/urunler');
    revalidatePath('/dashboard');
    return { success: true, product: data };
}

export async function updateProduct(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('category_id') as string;

    const { data, error } = await supabase
        .from('products')
        .update({
            name,
            description,
            price,
            category_id: categoryId || null,
        })
        .eq('id', id)
        .select(`
      *,
      categories:category_id(id, name)
    `)
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/urunler');
    revalidatePath('/dashboard');
    return { success: true, product: data };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/urunler');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function updateProductImage(productId: string, imageUrl: string) {
    void productId;
    void imageUrl;
    return { error: 'Bu sürümde ürün görsel yükleme kapalı.' };
}
