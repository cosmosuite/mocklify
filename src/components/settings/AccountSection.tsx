import { User, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Props {
  formData: any;
  onChange: (id: string, value: any) => void;
}

export function AccountSection({ formData, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full pl-10 rounded-lg border border-gray-200 bg-white h-10 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
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
    </div>
  );
}