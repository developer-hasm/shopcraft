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
    };
  };
}
