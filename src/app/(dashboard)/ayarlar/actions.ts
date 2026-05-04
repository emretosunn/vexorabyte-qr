"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateRestaurant(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Oturum açmanız gerekiyor" };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const theme = formData.get("theme") as string;

    const { error } = await supabase
        .from("restaurants")
        .update({
            name,
            description,
            phone,
            address,
            theme,
        })
        .eq("owner_id", user.id);

    if (error) {
        console.error("Restaurant update error:", error);
        return { error: error.message };
    }

    revalidatePath("/ayarlar");
    revalidatePath("/dashboard");
    return { success: true };
}
