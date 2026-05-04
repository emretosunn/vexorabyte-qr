import { Header } from "@/components/dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";

async function getSettingsData() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (!restaurant) {
        redirect("/onboarding");
    }

    return { restaurant };
}

export default async function AyarlarPage() {
    const { restaurant } = await getSettingsData();

    return (
        <div className="flex min-h-screen flex-col bg-slate-50/70 dark:bg-[#0a0a0d]">
            <Header title="Ayarlar" description="İşletme bilgileri, menü linki ve panel görünümü" />
            <SettingsForm restaurant={restaurant} />
        </div>
    );
}
