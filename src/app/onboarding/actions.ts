'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}

export async function createRestaurant(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Oturum açmanız gerekiyor' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const theme = formData.get('theme') as string || 'light';

    // Use provided slug or generate from name
    let slug = formData.get('slug') as string;
    if (!slug) {
        slug = generateSlug(name);
    } else {
        // Ensure manually entered slug is also clean
        slug = generateSlug(slug);
    }

    // Check if slug exists
    const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();

    if (existingRestaurant) {
        return { error: 'Bu URL adresi zaten kullanımda. Lütfen başka bir tane seçin.' };
    }

    const { data, error } = await supabase
        .from('restaurants')
        .insert({
            name,
            description,
            phone,
            slug,
            theme,
            owner_id: user.id,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        console.error('Restaurant creation error:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function checkOnboardingStatus() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { needsOnboarding: false, isAuthenticated: false };
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    return {
        needsOnboarding: !restaurant,
        isAuthenticated: true,
        userId: user.id
    };
}

export async function getUserRestaurant() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    return restaurant;
}

export async function getRestaurantStats() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id, view_count')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        return null;
    }

    // Get category count
    const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id);

    // Get product count
    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restaurant.id);

    // Get top products by view
    const { data: topProducts } = await supabase
        .from('products')
        .select('id, name, view_count, categories(name)')
        .eq('restaurant_id', restaurant.id)
        .order('view_count', { ascending: false })
        .limit(3);

    return {
        totalViews: restaurant.view_count || 0,
        categoryCount: categoryCount || 0,
        productCount: productCount || 0,
        topProducts: topProducts || []
    };
}
