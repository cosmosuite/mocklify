export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          user_id: string | null;
          platform: 'facebook' | 'twitter' | 'trustpilot' | 'email';
          content: string;
          title: string | null;
          author_name: string;
          author_handle: string | null;
          author_avatar: string;
          author_location: string | null;
          author_verified: boolean;
          author_review_count: number | null;
          metrics: Record<string, any>;
          tone: 'positive' | 'neutral' | 'negative';
          product_info: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          platform: 'facebook' | 'twitter' | 'trustpilot' | 'email';
          content: string;
          title?: string | null;
          author_name: string;
          author_handle?: string | null;
          author_avatar: string;
          author_location?: string | null;
          author_verified?: boolean;
          author_review_count?: number | null;
          metrics: Record<string, any>;
          tone: 'positive' | 'neutral' | 'negative';
          product_info: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      payment_notifications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          user_id: string | null;
          platform: 'stripe' | 'paypal';
          currency: string;
          recipients: Record<string, any>;
          wallpaper: string;
          custom_background: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          platform: 'stripe' | 'paypal';
          currency: string;
          recipients: Record<string, any>;
          wallpaper: string;
          custom_background?: string | null;
        };
        Update: Partial<Database['public']['Tables']['payment_notifications']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          email: string;
          name: string | null;
          avatar_url: string | null;
          settings: {
            language: string;
            timezone: string;
            email_notifications: boolean;
            product_updates: boolean;
          } | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          settings?: Record<string, any> | null;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}