import { supabase, getAuthHeaders } from './supabase';

interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  name?: string; // Display name for UI
  avatar_url?: string;
  settings?: {
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
    product_updates?: boolean;
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // First try to get existing profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If profile doesn't exist, get user data from auth and create profile
      if (error.code === 'PGRST116') {
        const { data: { user }, error: authError } = await supabase.auth.getUser(userId);
        
        if (authError) {
          console.error('Auth error:', authError);
          throw authError;
        }
        
        if (!user) {
          throw new Error('User not found');
        }

        const defaultSettings = {
          language: 'en',
          timezone: 'UTC',
          email_notifications: true,
          product_updates: true
        };

        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert([
            { 
              id: userId,
              email: user.email,
              created_at: new Date().toISOString(),
              settings: defaultSettings
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Failed to create user profile:', createError);
          throw new Error('Failed to create user profile');
        }

        return newProfile;
      }
      
      console.error('Failed to fetch user profile:', error);
      throw new Error('Failed to fetch user profile');
    }

    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

interface ProfileUpdates {
  name?: string;
  avatar_url?: string;
  settings?: {
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
    product_updates?: boolean;
  };
}

export async function updateUserProfile(userId: string, updates: {
  name?: string;
  avatar_url?: string;
  settings?: {
    language?: string;
    timezone?: string;
    email_notifications?: boolean;
    product_updates?: boolean;
  };
}): Promise<any> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    // First update auth metadata if name is being updated
    if (updates.name) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          name: updates.name,
          updated_at: new Date().toISOString()
        }
      });

      if (authError) {
        console.error('Failed to update auth metadata:', authError);
        throw authError;
      }
    }

    // Then update profile in users table with all changes
    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name?.trim(),
        settings: updates.settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }

    // Refresh the session to ensure changes are reflected immediately
    await supabase.auth.refreshSession();
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}