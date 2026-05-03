-- =====================================================
-- QR MENÜ SaaS - SUPABASE DATABASE SCHEMA
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (Kullanıcı Profilleri)
-- =====================================================
-- auth.users tablosu ile otomatik senkronize
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profil oluşturma trigger'ı (yeni kullanıcı kaydolduğunda)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger'dan önce oluşmuş kullanıcılar için profil backfill
insert into public.profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'avatar_url'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- =====================================================
-- 2. RESTAURANTS TABLE (Restoranlar)
-- =====================================================
create table public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null, -- Benzersiz URL slug'ı (değiştirilemez)
  description text,
  phone text,
  address text,
  logo_url text,
  cover_image_url text,
  theme text default 'light', -- 'light', 'dark', 'warm'
  is_active boolean default true,
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Slug için index (hızlı arama)
create index restaurants_slug_idx on public.restaurants(slug);
create index restaurants_owner_id_idx on public.restaurants(owner_id);

-- =====================================================
-- 3. CATEGORIES TABLE (Menü Kategorileri)
-- =====================================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  name text not null,
  description text,
  image_url text,
  sort_order integer default 0, -- Sıralama
  display_order integer default 0, -- Geriye dönük uyumluluk
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index categories_restaurant_id_idx on public.categories(restaurant_id);
create index categories_sort_order_idx on public.categories(sort_order);
create index categories_display_order_idx on public.categories(display_order);

-- =====================================================
-- 4. PRODUCTS TABLE (Ürünler)
-- =====================================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  image_url text,
  sort_order integer default 0,
  display_order integer default 0, -- Geriye dönük uyumluluk
  is_available boolean default true, -- Stokta var mı?
  is_featured boolean default false, -- Öne çıkan ürün mü?
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index products_restaurant_id_idx on public.products(restaurant_id);
create index products_category_id_idx on public.products(category_id);
create index products_sort_order_idx on public.products(sort_order);
create index products_display_order_idx on public.products(display_order);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- =====================================================

-- RLS'i etkinleştir
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- PROFILES POLİTİKALARI
-- Kullanıcılar sadece kendi profillerini görebilir ve düzenleyebilir
create policy "Kullanıcı kendi profilini görebilir"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

-- RESTAURANTS POLİTİKALARI
-- Restoran sahibi kendi restoranını yönetebilir
create policy "Restoran sahibi kendi restoranını görebilir"
  on public.restaurants for select
  using (auth.uid() = owner_id);

create policy "Restoran sahibi restoran oluşturabilir"
  on public.restaurants for insert
  with check (auth.uid() = owner_id);

create policy "Restoran sahibi kendi restoranını güncelleyebilir"
  on public.restaurants for update
  using (auth.uid() = owner_id);

create policy "Restoran sahibi kendi restoranını silebilir"
  on public.restaurants for delete
  using (auth.uid() = owner_id);

-- Herkese açık: slug ile restoran görüntülenebilir (menü sayfası için)
create policy "Herkes aktif restoranları görebilir"
  on public.restaurants for select
  using (is_active = true);

-- CATEGORIES POLİTİKALARI
-- Restoran sahibi kendi kategorilerini yönetebilir
create policy "Restoran sahibi kategorilerini görebilir"
  on public.categories for select
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi kategori ekleyebilir"
  on public.categories for insert
  with check (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi kategori güncelleyebilir"
  on public.categories for update
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi kategori silebilir"
  on public.categories for delete
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

-- Herkese açık: aktif restoranların kategorileri
create policy "Herkes aktif kategorileri görebilir"
  on public.categories for select
  using (
    is_active = true and
    restaurant_id in (
      select id from public.restaurants where is_active = true
    )
  );

-- PRODUCTS POLİTİKALARI
-- Restoran sahibi kendi ürünlerini yönetebilir
create policy "Restoran sahibi ürünlerini görebilir"
  on public.products for select
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi ürün ekleyebilir"
  on public.products for insert
  with check (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi ürün güncelleyebilir"
  on public.products for update
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

create policy "Restoran sahibi ürün silebilir"
  on public.products for delete
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

-- Herkese açık: aktif restoranların ürünleri
create policy "Herkes aktif ürünleri görebilir"
  on public.products for select
  using (
    is_available = true and
    restaurant_id in (
      select id from public.restaurants where is_active = true
    )
  );

-- =====================================================
-- 6. UPDATED_AT TRIGGER
-- =====================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_restaurants_updated_at
  before update on public.restaurants
  for each row execute procedure public.handle_updated_at();

create trigger handle_categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

create trigger handle_products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();
