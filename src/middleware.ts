import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session
    const { data: { user } } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protected routes - redirect to login if not authenticated
    const protectedRoutes = ['/dashboard', '/kategoriler', '/urunler', '/ayarlar', '/onboarding'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Auth routes - redirect to dashboard if already authenticated
    const authRoutes = ['/auth/login', '/auth/register'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isAuthRoute && user) {
        // Check if user has a restaurant
        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (!restaurant) {
            // User needs to complete onboarding
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Dashboard routes - check if onboarding is complete
    const dashboardRoutes = ['/dashboard', '/kategoriler', '/urunler', '/ayarlar'];
    const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

    if (isDashboardRoute && user) {
        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (!restaurant) {
            // Redirect to onboarding if no restaurant
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    // Onboarding route - redirect to dashboard if already has restaurant
    if (pathname === '/onboarding' && user) {
        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('id')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (restaurant) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
