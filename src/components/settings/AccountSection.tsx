import { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../lib/db';
import { cn } from '../../lib/utils';

interface Props {
  formData: any;
  onChange: (id: string, value: any) => void;
  onSave: () => void;
}

export function AccountSection({ formData, onChange, onSave }: Props) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      // Only update if the form data name is empty or different
      if (!formData.name || formData.name !== user.user_metadata.name) {
        onChange('name', user.user_metadata.name);
      }
    }
  }, [user, formData.name, onChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate name
    if (!formData.name?.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    const trimmedName = formData.name?.trim();

    try {
      // Update profile in Supabase
      await updateUserProfile(user.id, {
        name: trimmedName,
        settings: formData.settings
      });

      setSuccessMessage('Profile updated successfully');
      onSave();
    } catch (error) {
      console.error('Failed to update profile:', error);
      const message = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      setError(`${message}. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter your display name"
            className={cn(
              "w-full pl-10 rounded-lg border h-10 text-sm",
              "bg-white outline-none transition-colors",
              "border-gray-200 focus:border-gray-300",
              "focus:ring-2 focus:ring-gray-100"
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email || ''}
            disabled
            className={cn(
              "w-full pl-10 rounded-lg border border-gray-200 bg-gray-50 h-10 text-sm outline-none",
              "text-gray-500 cursor-not-allowed"
            )}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Email address cannot be changed
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className={cn(
          "inline-flex items-center justify-center px-4 h-10",
          "bg-gray-900 text-white text-sm font-medium rounded-lg",
          "hover:bg-gray-800 focus:outline-none focus:ring-2",
          "focus:ring-gray-900 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isSaving ? 'Updating...' : 'Save Changes'}
      </button>
    </div>
  );
}