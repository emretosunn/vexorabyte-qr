import { notFound } from 'next/navigation';
import { getRestaurantMenuBySlug } from './actions';
import { MenuClient } from './MenuClient';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    // Skip system routes
    const reservedRoutes = ['login', 'register', 'forgot-password', 'onboarding', 'dashboard', 'kategoriler', 'urunler', 'ayarlar', 'api', '_next'];
    if (reservedRoutes.includes(slug)) {
        return {};
    }

    const { data } = await getRestaurantMenuBySlug(slug);

    if (!data) {
        return {
            title: `Restoran Bulunamadı | ${SITE_NAME}`,
        };
    }

    return {
        title: `${data.restaurant.name} | ${SITE_NAME}`,
        description: data.restaurant.description || `${data.restaurant.name} dijital menüsü.`,
    };
}

export default async function RestaurantMenuPage({ params }: Props) {
    const { slug } = await params;

    // Skip system routes
    const reservedRoutes = ['login', 'register', 'forgot-password', 'onboarding', 'dashboard', 'kategoriler', 'urunler', 'ayarlar', 'api', '_next'];
    if (reservedRoutes.includes(slug)) {
        notFound();
    }

    const { data, error } = await getRestaurantMenuBySlug(slug);

    if (error || !data) {
        notFound();
    }

    return <MenuClient data={data} />;
}
