import { formatDistanceToNow } from 'date-fns';
import type { GeneratedTestimonial } from '../types';

// Import reaction images
const reactionIcons = {
  like: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bfbba5760ae59b82a.png',
    label: 'Like'
  },
  love: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bbac6c2d6458b001a.png',
    label: 'Love'
  },
  care: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bd6b97e1600a0efee.png',
    label: 'Care'
  },
  haha: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130cc621bcf19075bbe7.png',
    label: 'Haha'
  },
  wow: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130be7467649de1b8625.png',
    label: 'Wow'
  },
  sad: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130cc621bc521475bbe6.png',
    label: 'Sad'
  },
  angry: {
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bbbab9f92d299ec36.png',
    label: 'Angry'
  }
};

interface Props {
  testimonial: GeneratedTestimonial;
}

export function FacebookComment({ testimonial }: Props) {
  const reactions = testimonial.metrics.reactions || ['like'];

  return (
    <div id={`facebook-${testimonial.id}`} className="bg-white">
      {/* Header Section */}
      <div className="flex items-start space-x-2">
        <img
          src={testimonial.author.avatar}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          {/* Comment Content */}
          <div className="relative bg-gray-100 rounded-2xl px-4 py-2">
            <h3 className="font-semibold text-[15px] text-gray-900 leading-5">
              {testimonial.author.name}
            </h3>
            <p className="mt-0.5 text-[15px] text-gray-900 leading-5 whitespace-pre-wrap break-words">
              {testimonial.content}
            </p>

            {/* Reactions */}
            {testimonial.metrics.likes > 0 && (
              <div className="absolute -bottom-2 right-2 flex items-center">
                <div className="flex">
                  {reactions.slice(0, 3).map((reaction, index) => (
                    <div
                      key={reaction}
                      style={{
                        marginLeft: index === 0 ? '0' : '-4px',
                        zIndex: 3 - index,
                      }}
                    >
                      <div
                        className="w-[22px] h-[22px] rounded-full border border-white shadow-sm bg-white flex items-center justify-center overflow-hidden"
                        title={reactionIcons[reaction].label}
                      >
                        <img
                          src={reactionIcons[reaction].icon}
                          alt={reactionIcons[reaction].label}
                          className="w-[18px] h-[18px] object-contain"
                          style={{ isolation: 'isolate' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <span className="text-[13px] text-gray-500 ml-1.5">
                  {testimonial.metrics.likes.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center mt-1 pl-4 space-x-4">
            <span className="text-[12px] font-semibold text-[#65676B]">
              {testimonial.metrics.timeAgo}
            </span>
            <button className="text-[12px] font-semibold text-[#65676B] hover:underline">
              Like
            </button>
            <button className="text-[12px] font-semibold text-[#65676B] hover:underline">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}