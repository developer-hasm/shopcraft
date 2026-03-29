export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
        Update: {
          nickname?: string;
          avatar_url?: string | null;
          bio?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          category_id: string;
          seller_id: string;
          image_url: string | null;
          file_url: string | null;
          status: string;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          title: string;
          description?: string | null;
          price: number;
          category_id: string;
          seller_id: string;
          image_url?: string | null;
          file_url?: string | null;
          status?: string;
          is_featured?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          price?: number;
          category_id?: string;
          image_url?: string | null;
          file_url?: string | null;
          status?: string;
          is_featured?: boolean;
          deleted_at?: string | null;
        };
        };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          product_id: string;
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          buyer_id: string;
          product_id: string;
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount: number;
          status?: string;
        };
        Update: {
          stripe_session_id?: string | null;
          stripe_payment_intent_id?: string | null;
          amount?: number;
          status?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          product_id: string;
          url: string;
          sort_order?: number;
        };
        Update: {
          url?: string;
          sort_order?: number;
        };
      };
      product_files: {
        Row: {
          id: string;
          product_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          product_id: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
        };
        Update: {
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          ip_address: string | null;
          downloaded_at: string;
        };
        Insert: {
          order_id: string;
          user_id: string;
          ip_address?: string | null;
        };
        Update: Record<string, never>;
      };
    };
  };
}
