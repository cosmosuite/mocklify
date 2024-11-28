import { cn } from '../../../lib/utils';
import type { SocialMetrics } from '../../../types';

interface Props {
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

export function EmailMetrics({ metrics, onChange }: Props) {
  const defaultMetrics = {
    senderName: '',
    subject: 'Exceptional Experience with Your Product',
    timeAgo: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    starred: false,
    important: false
  };

  // Merge with defaults to ensure all fields have values
  const currentMetrics = { ...defaultMetrics, ...metrics };

  const today = new Date().toISOString().split('T')[0];
  // Handle relative time strings like "2h ago" or "Mar 15"
  const getDateFromTimeAgo = () => {
    if (!currentMetrics.timeAgo) return today;
    // If it's already a date string like "Mar 15", convert it
    if (currentMetrics.timeAgo.includes(' ')) {
      const date = new Date();
      const [month, day] = currentMetrics.timeAgo.split(' ');
      date.setMonth(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month));
      date.setDate(parseInt(day));
      return date.toISOString().split('T')[0];
    }
    return today;
  };

  const formattedDate = getDateFromTimeAgo();

  const handleChange = (field: keyof SocialMetrics, value: any) => {
    onChange(field, value);
  };

  return (
    <div className="space-y-4">
      {/* First Row - Full Width Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Sender Name
          </label>
          <input
            type="text"
            value={currentMetrics.senderName}
            onChange={(e) => handleChange('senderName', e.target.value)}
            onBlur={(e) => handleChange('senderName', e.target.value)}
            className={cn(
              "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
              "outline-none transition-colors",
              "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
              "border-[#2F2F2F]"
            )}
            placeholder="Enter sender name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={currentMetrics.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={cn(
              "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
              "outline-none transition-colors",
              "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
              "border-[#2F2F2F]"
            )}
            placeholder="Enter email subject"
          />
        </div>
      </div>

      {/* Second Row - Date and Flags */}
      <div className="grid grid-cols-[1fr,auto] gap-4">
        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Date
          </label>
          <input
            type="date"
            value={formattedDate}
            max={today}
            onChange={(e) => {
              const date = new Date(e.target.value);
              const formatted = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });
              handleChange('timeAgo', formatted);
            }}
            className={cn(
              "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white",
              "outline-none transition-colors",
              "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
              "border-[#2F2F2F]"
            )}
          />
        </div>
        <div className="flex flex-col justify-center space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentMetrics.starred}
              onChange={(e) => handleChange('starred', e.target.checked)}
              className="h-4 w-4 rounded border-[#2F2F2F] bg-[#1F1F1F] text-[#CCFC7E] focus:ring-[#CCFC7E] focus:ring-offset-[#0F0F0F]"
            />
            <span className="text-sm text-white">Starred</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentMetrics.important}
              onChange={(e) => handleChange('important', e.target.checked)}
              className="h-4 w-4 rounded border-[#2F2F2F] bg-[#1F1F1F] text-[#CCFC7E] focus:ring-[#CCFC7E] focus:ring-offset-[#0F0F0F]"
            />
            <span className="text-sm text-white">Important</span>
          </label>
        </div>
      </div>
    </div>
  );
}