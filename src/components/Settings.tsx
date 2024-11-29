import { useState, useEffect } from 'react';
import { User, Globe2, Bell, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PasswordSection } from './settings/PasswordSection';
import { AccountSection } from './settings/AccountSection';
import { PreferencesSection } from './settings/PreferencesSection';
import { NotificationsSection } from './settings/NotificationsSection';
import { cn } from '../lib/utils';

type SettingsTab = 'account' | 'preferences' | 'notifications' | 'security';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email ?? '',
    language: 'en',
    timezone: 'UTC',
    email_notifications: true,
    product_updates: true
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData(prev => ({
            ...prev,
            name: data.name || user?.user_metadata?.name || '',
            ...data.settings
          }));
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  useEffect(() => {
    // Get tab from URL hash if present
    const hash = window.location.hash.slice(1);
    if (hash && ['account', 'preferences', 'notifications', 'security'].includes(hash)) {
      setActiveTab(hash as SettingsTab);
    }
  }, []);

  // Handle tab changes
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    history.pushState(null, '', `#${tab}`);
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-sm text-red-600">Please sign in to access settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Settings
          </h1>
        </div>
        
        <div className="grid grid-cols-[240px,1fr] gap-8">
          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {[
              { id: 'account', label: 'Account', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Globe2 },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Lock }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : activeTab === 'account' && (
                <AccountSection 
                  formData={formData}
                  onChange={handleInputChange}
                  onSave={() => {}}
                />
              )}
              
              {activeTab === 'preferences' && (
                <PreferencesSection 
                  formData={formData}
                  onChange={handleInputChange} 
                />
              )}
              
              {activeTab === 'notifications' && (
                <NotificationsSection 
                  formData={formData}
                  onChange={handleInputChange} 
                />
              )}
              
              {activeTab === 'security' && (
                <PasswordSection 
                  onSuccess={() => {
                    alert('Password updated successfully!');
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}