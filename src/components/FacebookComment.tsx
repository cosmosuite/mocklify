import { formatDistanceToNow } from 'date-fns';
import type { GeneratedTestimonial } from '../types';
import { ThumbsUp, Heart, Star, Smile, AlertCircle, Frown, Angry } from 'lucide-react';

interface Props {
  testimonial: GeneratedTestimonial;
}

const reactionIcons = {
  like: { icon: ThumbsUp, color: '#2078f4' },
  love: { icon: Heart, color: '#f33e58' },
  care: { icon: Star, color: '#f7b125' },
  haha: { icon: Smile, color: '#f7b125' },
  wow: { icon: AlertCircle, color: '#f7b125' },
  sad: { icon: Frown, color: '#f7b125' },
  angry: { icon: Angry, color: '#e9710f' }
};

export function FacebookComment({ testimonial }: Props) {
  const reactions = testimonial.metrics.reactions || ['like'];

  return (
    <div id={`facebook-${testimonial.id}`}>
      <div className="flex items-start space-x-2">
        <img
          src={testimonial.author.avatar}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="relative bg-gray-100 rounded-2xl px-4 py-2">
            <h3 className="font-semibold text-[15px] text-gray-900 leading-5">
              {testimonial.author.name}
            </h3>
            <p className="mt-0.5 text-[15px] text-gray-900 leading-5 whitespace-pre-wrap break-words">
              {testimonial.content}
            </p>
            
            {testimonial.metrics.likes > 0 && (
              <div className="absolute -bottom-2 right-2 flex items-center">
                <div className="flex -space-x-1">
                  {reactions.slice(0, 3).map((reaction, index) => {
                    const ReactionIcon = reactionIcons[reaction].icon;
                    return (
                      <div
                        key={reaction}
                        className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: reactionIcons[reaction].color }}
                      >
                        <ReactionIcon className="w-3 h-3 text-white" />
                      </div>
                    );
                  })}
                </div>
                <span className="text-[13px] text-gray-500 ml-1">
                  {testimonial.metrics.likes.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-1 pl-4 space-x-4">
            <span className="text-[12px] font-semibold text-[#aaadb0]">{testimonial.metrics.timeAgo}</span>
            <button className="text-[12px] font-semibold text-[#696c6f] hover:underline">
              Like
            </button>
            <button className="text-[12px] font-semibold text-[#696c6f] hover:underline">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}