export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    is_active: boolean | null
                    name: string
                    restaurant_id: string
                    sort_order: number | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    name: string
                    restaurant_id: string
                    sort_order?: number | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    name?: string
                    restaurant_id?: string
                    sort_order?: number | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "categories_restaurant_id_fkey"
                        columns: ["restaurant_id"]
                        isOneToOne: false
                        referencedRelation: "restaurants"
                        referencedColumns: ["id"]
                    },
                ]
            }
            products: {
                Row: {
                    allergens: string[] | null
                    calories: number | null
                    category_id: string
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    is_active: boolean | null
                    is_featured: boolean | null
                    name: string
                    preparation_time: number | null
                    price: number
                    restaurant_id: string
                    sort_order: number | null
                    updated_at: string | null
                    view_count: number | null
                }
                Insert: {
                    allergens?: string[] | null
                    calories?: number | null
                    category_id: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    name: string
                    preparation_time?: number | null
                    price: number
                    restaurant_id: string
                    sort_order?: number | null
                    updated_at?: string | null
                    view_count?: number | null
                }
                Update: {
                    allergens?: string[] | null
                    calories?: number | null
                    category_id?: string
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    name?: string
                    preparation_time?: number | null
                    price?: number
                    restaurant_id?: string
                    sort_order?: number | null
                    updated_at?: string | null
                    view_count?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "products_restaurant_id_fkey"
                        columns: ["restaurant_id"]
                        isOneToOne: false
                        referencedRelation: "restaurants"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    plan: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    plan?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    plan?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            restaurants: {
                Row: {
                    address: string | null
                    cover_image_url: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    is_active: boolean | null
                    logo_url: string | null
                    name: string
                    owner_id: string
                    phone: string | null
                    primary_color: string | null
                    qr_code_url: string | null
                    slug: string
                    theme: string | null
                    updated_at: string | null
                    view_count: number | null
                    website: string | null
                }
                Insert: {
                    address?: string | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    logo_url?: string | null
                    name: string
                    owner_id: string
                    phone?: string | null
                    primary_color?: string | null
                    qr_code_url?: string | null
                    slug: string
                    theme?: string | null
                    updated_at?: string | null
                    view_count?: number | null
                    website?: string | null
                }
                Update: {
                    address?: string | null
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_active?: boolean | null
                    logo_url?: string | null
                    name?: string
                    owner_id?: string
                    phone?: string | null
                    primary_color?: string | null
                    qr_code_url?: string | null
                    slug?: string
                    theme?: string | null
                    updated_at?: string | null
                    view_count?: number | null
                    website?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "restaurants_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenient type aliases
export type Profile = Tables<'profiles'>
export type Restaurant = Tables<'restaurants'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>

export type ProfileInsert = TablesInsert<'profiles'>
export type RestaurantInsert = TablesInsert<'restaurants'>
export type CategoryInsert = TablesInsert<'categories'>
export type ProductInsert = TablesInsert<'products'>

export type ProfileUpdate = TablesUpdate<'profiles'>
export type RestaurantUpdate = TablesUpdate<'restaurants'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type ProductUpdate = TablesUpdate<'products'>
