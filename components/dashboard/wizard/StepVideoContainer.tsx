import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface StepVideoContainerProps {
  videoUrl?: string;
  posterImage?: string;
  title?: string;
}

export const StepVideoContainer: React.FC<StepVideoContainerProps> = ({
  videoUrl = "https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0",
  posterImage,
  title = "Video Tutorial"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('autoplay=1')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
  };

  return (
    <div className="w-full max-w-4xl sm:max-w-5xl mx-auto">
      <div className="relative aspect-video bg-[#060a12] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl w-full">
        {posterImage && !isPlaying ? (
          <div 
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer group"
          >
            <img 
              src={posterImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-[#FF5A1F] flex items-center justify-center shadow-2xl group-hover:bg-[#FF5A1F] group-hover:text-white transition-all transform group-hover:scale-110 duration-300">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <iframe 
            className="w-full h-full"
            src={posterImage ? getEmbedUrl(videoUrl) : videoUrl} 
            title={title} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};
