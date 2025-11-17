"use client";

import { useEffect, useRef, useState } from "react";

interface TikTokEmbedProps {
  videoUrl: string;
  videoId?: string;
  className?: string;
}

export function TikTokEmbed({ videoUrl, videoId, className = "" }: TikTokEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    
    script.onload = () => {
      setIsLoading(false);
      // Trigger TikTok embed refresh
      if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render(containerRef.current);
      }
    };

    script.onerror = () => {
      setError(true);
      setIsLoading(false);
    };

    // Only add script if not already present
    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      document.head.appendChild(script);
    } else {
      setIsLoading(false);
      // Script already loaded, just render
      if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render(containerRef.current);
      }
    }

    return () => {
      // Cleanup is not needed as script should persist for all embeds
    };
  }, [videoUrl]);

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-4 ${className}`}>
        <p className="text-gray-500 text-sm">No se pudo cargar el video</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {isLoading && (
        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
      <blockquote
        className="tiktok-embed"
        cite={videoUrl}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={videoUrl}>
            Ver en TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}

// Type declaration for TikTok embed
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: (element: HTMLElement | null) => void;
      };
    };
  }
}
