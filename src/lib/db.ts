import { supabase, getAuthHeaders } from './supabase';

interface UserProfile {
  id: string;
  created_at: string;
  email: string;
  name?: string;
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
    const headers = await getAuthHeaders();
    
    // First try to get existing profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
      .headers(headers);

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
          .single()
          .headers(headers);

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

export async function updateUserProfile(userId: string, updates: ProfileUpdates): Promise<UserProfile> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const headers = await getAuthHeaders();
    
    // Get existing profile to merge settings
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users')
      .select('settings')
      .eq('id', userId)
      .single()
      .headers(headers);

    if (fetchError) {
      console.error('Failed to fetch existing profile:', fetchError);
      throw fetchError;
    }

    // Merge existing and new settings
    const mergedSettings = {
      ...existingProfile?.settings,
      ...updates.settings
    };

    // Update profile with merged settings
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        settings: mergedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
      .headers(headers);

    if (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}