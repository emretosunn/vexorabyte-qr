import { Save, Globe, Palette, Store, Upload, Link, Sun, Moon, Check, Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

async function getSettingsData() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        redirect('/onboarding');
    }

    return { restaurant };
}

export default async function AyarlarPage() {
    const { restaurant } = await getSettingsData();

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Ayarlar" description="Restoran ayarlarınızı yönetin" />

            <SettingsForm restaurant={restaurant} />
        </div>
    );
}
