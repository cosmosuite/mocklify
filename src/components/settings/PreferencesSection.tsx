import { Globe } from 'lucide-react';

interface Props {
  formData: any;
  onChange: (id: string, value: any) => void;
}

export function PreferencesSection({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          value={formData.language || 'en'}
          onChange={(e) => onChange('language', e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={formData.timezone || 'UTC'}
          onChange={(e) => onChange('timezone', e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 h-10 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
        >
          <option value="UTC">UTC</option>
          <option value="EST">Eastern Time</option>
          <option value="PST">Pacific Time</option>
        </select>
      </div>
    </div>
  );
}