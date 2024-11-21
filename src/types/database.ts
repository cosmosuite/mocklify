export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
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
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      payment_notifications: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          platform: 'stripe' | 'paypal';
          currency: string;
          recipients: Record<string, any>;
          wallpaper: string;
          custom_background: string | null;
        };
        Insert: Omit<Database['public']['Tables']['payment_notifications']['Row'], 'created_at' | 'updated_at' | 'id'>;
        Update: Partial<Database['public']['Tables']['payment_notifications']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}