import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/site";
import { getRestaurantMenuBySlug } from "./actions";
import { MenuClient } from "./MenuClient";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

const reservedRoutes = [
    "login",
    "register",
    "forgot-password",
    "onboarding",
    "dashboard",
    "kategoriler",
    "urunler",
    "ayarlar",
    "api",
    "_next",
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

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

    if (reservedRoutes.includes(slug)) {
        notFound();
    }

    const { data, error } = await getRestaurantMenuBySlug(slug);

    if (error || !data) {
        notFound();
    }

    return <MenuClient data={data} />;
}
