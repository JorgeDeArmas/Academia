'use client';

import { useEffect, useRef } from 'react';

interface TikTokCreatorProfileProps {
  username: string; // TikTok unique_id (e.g., "scout2015")
  className?: string;
}

export default function TikTokCreatorProfile({ 
  username, 
  className = '' 
}: TikTokCreatorProfileProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load TikTok embed script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
    
    if (!existingScript) {
      document.body.appendChild(script);
    } else {
      // If script exists, trigger re-render of embeds
      if (window.tiktokEmbed) {
        window.tiktokEmbed.lib.render(embedRef.current);
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, [username]);

  return (
    <div ref={embedRef} className={className}>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@${username}`}
        data-unique-id={username}
        data-embed-type="creator"
        style={{ maxWidth: '720px', minWidth: '288px' }}
        data-embed-from="oembed"
      >
        <section>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.tiktok.com/@${username}?refer=creator_embed`}
          >
            @{username}
          </a>
        </section>
      </blockquote>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    tiktokEmbed?: {
      lib: {
        render: (element: HTMLElement | null) => void;
      };
    };
  }
}
