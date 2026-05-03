import { Sidebar, MobileNav } from "@/components/dashboard";
import { getUserAndRestaurant } from "@/lib/data";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { restaurant, profile } = await getUserAndRestaurant();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#13131a]">
            {/* Desktop Sidebar */}
            <Sidebar
                restaurantName={restaurant?.name}
                plan={profile?.plan || 'free'}
            />

            {/* Mobile Navigation */}
            <MobileNav
                restaurantName={restaurant?.name}
                plan={profile?.plan || 'free'}
            />

            {/* Main Content */}
            <main className="lg:pl-72">
                <div className="min-h-screen">{children}</div>
            </main>
        </div>
    );
}
