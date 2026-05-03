import { createClient } from './client';

const supabase = createClient();

export async function uploadProductImage(
    file: File,
    restaurantId: string,
    productId: string
): Promise<{ url: string | null; error: string | null }> {
    try {
        // Create unique file path: restaurant_id/product_id/filename.ext
        const fileExt = file.name.split('.').pop();
        const fileName = `${restaurantId}/${productId}/${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Upload error:', error);
            return { url: null, error: error.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

        return { url: urlData.publicUrl, error: null };
    } catch (err) {
        console.error('Upload exception:', err);
        return { url: null, error: 'Dosya yüklenirken bir hata oluştu' };
    }
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
    try {
        // Extract path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/storage/v1/object/public/product-images/');
        if (pathParts.length !== 2) return false;

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from('product-images')
            .remove([filePath]);

        return !error;
    } catch {
        return false;
    }
}

export async function uploadRestaurantLogo(
    file: File,
    restaurantId: string
): Promise<{ url: string | null; error: string | null }> {
    try {
        // Create unique file path: logos/restaurant_id/filename.ext
        const fileExt = file.name.split('.').pop();
        const fileName = `logos/${restaurantId}/${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Logo upload error:', error);
            return { url: null, error: error.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

        return { url: urlData.publicUrl, error: null };
    } catch (err) {
        console.error('Logo upload exception:', err);
        return { url: null, error: 'Logo yüklenirken bir hata oluştu' };
    }
}
