import { createClient } from "@/lib/supabase/server";

export async function getUserAndRestaurant() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { user: null, profile: null, restaurant: null };
    }

    const [profileResult, restaurantResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
            .from('restaurants')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()
    ]);

    return {
        user,
        profile: profileResult.data,
        restaurant: restaurantResult.data
    };
}
