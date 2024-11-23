import { ThumbsUp, Share, Flag } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';

interface Props {
  testimonial: GeneratedTestimonial;
}

export function TrustpilotReview({ testimonial }: Props) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['#FF3B3B', '#FF9E3B', '#FFD93B', '#4BDB7C', '#3B8BFF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderStars = () => {
    return (
      <div className="flex h-6 space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star}
            className={`h-full aspect-square ${star <= testimonial.metrics.rating ? 'bg-[#06b57a]' : 'bg-[#dcdce6]'}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-full w-full text-white"
              fill="currentColor"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id={`trustpilot-${testimonial.id}`} className="bg-white rounded-lg border border-gray-200">
      <article className="divide-y divide-gray-200">
        {/* User Info Section */}
        <div className="p-4 flex items-start space-x-4">
          <div 
            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: getRandomColor() }}
          >
            {getInitials(testimonial.author.name)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">{testimonial.author.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>{testimonial.author.reviewCount} review</span>
              {testimonial.author.location && (
                <div className="flex items-center space-x-1">
                  <span>·</span>
                  <div className="flex items-center">
                    <svg 
                      viewBox="0 0 16 16" 
                      fill="currentColor" 
                      className="w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.404 1.904A6.5 6.5 0 0 1 14.5 6.5v.01c0 .194 0 .396-.029.627l-.004.03-.023.095c-.267 2.493-1.844 4.601-3.293 6.056a18.723 18.723 0 0 1-2.634 2.19 11.015 11.015 0 0 1-.234.154l-.013.01-.004.002h-.002L8 15.25l-.261.426h-.002l-.004-.003-.014-.009a13.842 13.842 0 0 1-.233-.152 18.388 18.388 0 0 1-2.64-2.178c-1.46-1.46-3.05-3.587-3.318-6.132l-.003-.026v-.068c-.025-.2-.025-.414-.025-.591V6.5a6.5 6.5 0 0 1 1.904-4.596ZM8 15.25l-.261.427.263.16.262-.162L8 15.25Zm-.002-.598a17.736 17.736 0 0 0 2.444-2.04c1.4-1.405 2.79-3.322 3.01-5.488l.004-.035.026-.105c.018-.153.018-.293.018-.484a5.5 5.5 0 0 0-11 0c0 .21.001.371.02.504l.005.035v.084c.24 2.195 1.632 4.109 3.029 5.505a17.389 17.389 0 0 0 2.444 2.024Z" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM4.5 6.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" />
                    </svg>
                    <span className="ml-1">{testimonial.author.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {renderStars()}
              {testimonial.author.isVerified && (
                <div className="flex items-center space-x-1" style={{ color: '#6b6a66' }}>
                  <svg 
                    viewBox="0 0 16 16" 
                    fill="currentColor" 
                    className="w-3.5 h-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm-.888-4.44 5.603-5.87-.723-.69-4.897 5.13-2.388-2.388L4 8.449l3.112 3.112Z" />
                  </svg>
                  <span className="text-sm">Verified</span>
                </div>
              )}
            </div>
            <span className="text-gray-500 text-sm">
              {new Date(testimonial.timestamp).toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {testimonial.title && (
            <h2 className="text-[15px] font-bold text-gray-900 mb-3">
              {testimonial.title}
            </h2>
          )}

          <p className="text-[15px] text-gray-900 mb-4 leading-relaxed">
            {testimonial.content}
          </p>

          {testimonial.metrics.dateOfExperience && (
            <p className="text-sm">
              <span className="font-bold">Date of experience: </span>
              {testimonial.metrics.dateOfExperience}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-[#06b57a]">
              <ThumbsUp size={14} />
              <span className="text-sm">Useful</span>
              {testimonial.metrics.usefulCount && testimonial.metrics.usefulCount > 0 && (
                <span className="text-sm font-semibold ml-1">
                  {testimonial.metrics.usefulCount}
                </span>
              )}
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-[#06b57a]">
              <Share size={14} />
              <span className="text-sm">Share</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-[#06b57a]">
            <Flag size={14} />
          </button>
        </div>
      </article>
    </div>
  );
}