import React, { useState, useRef, useEffect } from 'react';

interface GamePlayerProps {
  gameUrl: string;
  title: string;
  controls?: string;
  className?: string;
}

export default function GamePlayer({ gameUrl, title, controls, className = '' }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load game. Please try refreshing the page.');
  };

  // Add timeout fallback to remove loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);


  return (
    <div 
      ref={containerRef}
      className={`game-player-container relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
    >


      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-lg font-semibold mb-2">Loading {title}...</div>
            <div className="text-sm opacity-70">This may take a moment</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-center p-8">
          <div>
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <div className="text-lg font-semibold mb-2">Game Failed to Load</div>
            <div className="text-sm opacity-70 mb-4">{error}</div>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                if (iframeRef.current) {
                  iframeRef.current.src = iframeRef.current.src; // Reload iframe
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Game Iframe */}
      <iframe
        ref={iframeRef}
        src={gameUrl}
        title={title}
        className={`w-full h-96 md:h-[500px] lg:h-[600px] transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          border: 'none',
          objectFit: 'contain'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock"
      />

    </div>
  );
}