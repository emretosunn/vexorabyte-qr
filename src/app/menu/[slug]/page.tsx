import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/site";
import { getRestaurantMenuBySlug } from "../../[slug]/actions";
import { MenuClient } from "../../[slug]/MenuClient";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
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

export default async function MenuBySlugPage({ params }: Props) {
    const { slug } = await params;
    const { data, error } = await getRestaurantMenuBySlug(slug);

    if (error || !data) {
        notFound();
    }

    return <MenuClient data={data} />;
}
