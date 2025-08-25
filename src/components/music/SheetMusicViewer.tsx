import React, { useEffect, useRef, useState } from 'react';
import * as alphaTab from '@coderline/alphatab';

interface SheetMusicViewerProps {
  musicData: string;
  title?: string;
  format?: 'alphaTex' | 'musicxml' | 'gp';
}

const SheetMusicViewer: React.FC<SheetMusicViewerProps> = ({ 
  musicData, 
  title,
  format = 'alphaTex'
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<alphaTab.AlphaTabApi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    // Initialize alphaTab with correct font directory and audio synthesis
    const settings = {
      core: {
        engine: 'svg',
        logLevel: 1, // Info level  
        useWorkers: false,
        fontDirectory: '/font/',
      },
      display: {
        staveProfile: 3, // Tablature only
      },
      notation: {
        notationMode: 0, // Standard notation
        elements: {
          scoreTitle: true,
          scoreArtist: true,
          guitarTuning: true,
        }
      },
      // No player configuration for tablature-only display
    };

    try {
      const api = new alphaTab.AlphaTabApi(viewerRef.current, settings);
      
      // Set up event listeners
      api.renderStarted.on(() => {
        setIsLoading(true);
      });
      
      api.renderFinished.on(() => {
        setIsLoading(false);
        console.log('alphaTab render finished successfully');
      });

      api.error.on((error) => {
        console.error('alphaTab error:', error);
        setError(`alphaTab error: ${error}`);
        setIsLoading(false);
      });


      // Load the music data
      try {
        console.log('Loading alphaTab with format:', format);
        console.log('Music data:', musicData);
        
        if (format === 'alphaTex') {
          api.tex(musicData);
        } else if (format === 'musicxml') {
          // For MusicXML, we'd need to load it differently
          const encoder = new TextEncoder();
          const data = encoder.encode(musicData);
          api.load(data);
        }
      } catch (loadError) {
        console.error('Error loading music data:', loadError);
        setError(`Error loading music data: ${loadError}`);
        setIsLoading(false);
      }

      apiRef.current = api;
    } catch (error) {
      console.error('Error initializing alphaTab:', error);
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, [musicData, format]);


  const handlePrint = () => {
    if (!apiRef.current) return;
    apiRef.current.print();
  };

  const handleDownload = () => {
    if (!apiRef.current) return;
    // Export as image or PDF
    apiRef.current.renderToCanvas();
  };

  return (
    <div className="sheet-music-viewer bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center">
                <span className="font-semibold mr-1">Format:</span> Guitar Tablature
              </span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">

            {/* Utility buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title="Print"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title="Download"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Music Display */}
      <div className="relative">
        {isLoading && !error && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-gray-600">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading sheet music...
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-red-600 text-center">
              <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 text-gray-500">Check console for details</p>
            </div>
          </div>
        )}
        
        {/* alphaTab will render here */}
        <div 
          ref={viewerRef}
          className="at-viewport p-4 lg:p-6 bg-gray-50 min-h-[600px]"
          data-at-player-height="80"
        />
      </div>

      {/* CSS for alphaTab */}
      <style>{`
        .sheet-music-viewer .at-surface {
          background: white;
        }
        
        
        @media print {
          .sheet-music-viewer .bg-gray-900 {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SheetMusicViewer;