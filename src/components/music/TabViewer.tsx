import React, { useState, useRef, useEffect } from 'react';

interface TabViewerProps {
  tabs: string;
  title?: string;
  tuning?: string;
  capo?: string;
  tempo?: string;
  songKey?: string;
}

interface TabMeasure {
  strings: string[][];
}

const TabViewer: React.FC<TabViewerProps> = ({ 
  tabs, 
  title,
  tuning = "E A D G B E",
  capo = "no capo",
  tempo,
  songKey
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [playbackTempo, setPlaybackTempo] = useState(parseInt(tempo?.replace(' BPM', '') || '120'));
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      tabContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Playback controls
  const startPlayback = () => {
    if (intervalRef.current) return; // Already playing
    
    setIsPlaying(true);
    const beatDuration = 60000 / playbackTempo; // Convert BPM to milliseconds per beat
    
    intervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        // Count total measures from grid sections
        const totalMeasures = gridSections.reduce((total, section) => {
          return total + (section.measures?.length || 0);
        }, 0);
        
        const nextBeat = prev + 1;
        if (nextBeat >= totalMeasures * 4) { // Assuming 4 beats per measure
          stopPlayback();
          return 0;
        }
        return nextBeat;
      });
    }, beatDuration);
  };

  const stopPlayback = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Parse tabs into grid format
  const parseTabsToGrid = (content: string) => {
    const lines = content.trim().split('\n');
    const sections = [];
    let currentSection = null;
    let currentTabGroup = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check for section headers
      if (line.startsWith('[') && line.endsWith(']')) {
        if (currentTabGroup.length > 0) {
          if (currentSection) {
            sections.push({ header: currentSection, measures: processTabGroup(currentTabGroup) });
          }
          currentTabGroup = [];
        }
        currentSection = line;
        continue;
      }
      
      // Check if this is a tab line
      const isTabLine = /^[eEbBgGdDaAT]\s*[\|\-\[]/.test(line);
      
      if (isTabLine) {
        currentTabGroup.push(line);
        // Process group when we have 6 lines (or 4 for bass)
        if (currentTabGroup.length === 6 || (currentTabGroup.length === 4 && line.startsWith('G'))) {
          if (!currentSection) currentSection = '';
          sections.push({ header: currentSection, measures: processTabGroup(currentTabGroup) });
          currentTabGroup = [];
          currentSection = null;
        }
      } else if (line && !line.startsWith('[')) {
        // Non-tab text
        if (currentTabGroup.length > 0) {
          if (currentSection) {
            sections.push({ header: currentSection, measures: processTabGroup(currentTabGroup) });
          }
          currentTabGroup = [];
          currentSection = null;
        }
        sections.push({ header: '', text: line });
      }
    }
    
    // Process remaining group
    if (currentTabGroup.length > 0) {
      sections.push({ header: currentSection || '', measures: processTabGroup(currentTabGroup) });
    }
    
    return sections;
  };

  // Process a group of 6 tab lines into measures
  const processTabGroup = (tabLines: string[]): TabMeasure[] => {
    if (tabLines.length === 0) return [];
    
    const measures: TabMeasure[] = [];
    const stringData: string[][] = tabLines.map(line => {
      // Remove string label and split by measures
      const cleanLine = line.replace(/^[eEbBgGdDaAT]\s*[\|\-\[]/, '');
      return cleanLine.split('|').map(measure => measure.trim());
    });
    
    // Get max number of measures
    const maxMeasures = Math.max(...stringData.map(s => s.length));
    
    // Find the maximum length of any measure across all strings
    let maxMeasureLength = 0;
    for (let m = 0; m < maxMeasures; m++) {
      for (let s = 0; s < stringData.length; s++) {
        const measureContent = stringData[s][m] || '';
        maxMeasureLength = Math.max(maxMeasureLength, measureContent.length);
      }
    }
    
    // Create measure objects with normalized widths
    for (let m = 0; m < maxMeasures; m++) {
      const measure: TabMeasure = {
        strings: stringData.map(string => {
          let measureContent = string[m] || '';
          
          // Pad measure to maximum length with spaces/dashes
          while (measureContent.length < maxMeasureLength) {
            measureContent += '-';
          }
          
          // Split measure content into individual characters/positions
          return measureContent.split('').map(char => char === '-' ? '' : char);
        })
      };
      
      // Only add non-empty measures
      if (measure.strings.some(s => s.some(c => c !== ''))) {
        measures.push(measure);
      }
    }
    
    return measures;
  };


  const gridSections = parseTabsToGrid(tabs);

  return (
    <div className="tab-viewer bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center">
                <span className="font-semibold mr-1">Tuning:</span> {tuning}
              </span>
              {songKey && (
                <span className="flex items-center">
                  <span className="font-semibold mr-1">Key:</span> {songKey}
                </span>
              )}
              <span className="flex items-center">
                <span className="font-semibold mr-1">Capo:</span> {capo}
              </span>
              {tempo && (
                <span className="flex items-center">
                  <span className="font-semibold mr-1">Tempo:</span> {tempo}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayback}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
                title={isPlaying ? "Stop playback" : "Start playback"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              
              {/* Tempo Control */}
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setPlaybackTempo(Math.max(40, playbackTempo - 10))}
                  className="px-2 py-1 hover:bg-gray-800 rounded transition-colors"
                  title="Decrease tempo"
                >
                  -
                </button>
                <span className="min-w-[60px] text-center">
                  {playbackTempo} BPM
                </span>
                <button
                  onClick={() => setPlaybackTempo(Math.min(200, playbackTempo + 10))}
                  className="px-2 py-1 hover:bg-gray-800 rounded transition-colors"
                  title="Increase tempo"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Toggle fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 9V5H5m0 4h4m6-4h4v4m0-4h-4m-6 10v4h4m-4-4h4m6 4h4v-4m-4 0h4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                )}
              </svg>
            </button>
            <button
              onClick={() => {
                const blob = new Blob([tabs], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${title || 'tabs'}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Download tabs"
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

      {/* Tab Content */}
      <div 
        ref={tabContainerRef}
        className={`p-4 lg:p-6 overflow-x-auto bg-gray-50 ${
          isFullscreen ? 'fullscreen-tabs' : ''
        }`}
      >
        <div className="tab-grid-content">
            {gridSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                {section.header && (
                  <h4 className="text-base font-bold text-gray-700 mb-3">
                    {section.header}
                  </h4>
                )}
                {section.text && (
                  <p className="text-xs text-gray-600 italic mb-3">{section.text}</p>
                )}
                {section.measures && (
                  <div className="tab-grid-wrapper overflow-x-auto">
                    <table className="tab-grid">
                      <tbody>
                        {/* Create 6 rows for 6 strings */}
                        {[0, 1, 2, 3, 4, 5].map(stringIndex => (
                          <tr key={stringIndex}>
                            <td className="string-label">
                              {['e', 'B', 'G', 'D', 'A', 'E'][stringIndex]}
                            </td>
                            {section.measures.map((measure, measureIndex) => {
                              // Calculate global measure index for highlighting
                              let globalMeasureIndex = 0;
                              for (let i = 0; i < sectionIndex; i++) {
                                globalMeasureIndex += gridSections[i].measures?.length || 0;
                              }
                              globalMeasureIndex += measureIndex;
                              
                              const isCurrentMeasure = isPlaying && Math.floor(currentBeat / 4) === globalMeasureIndex;
                              
                              return (
                                <React.Fragment key={measureIndex}>
                                  <td className="measure-separator">|</td>
                                  {measure.strings[stringIndex]?.map((note, noteIndex) => (
                                    <td key={noteIndex} className={`tab-cell ${isCurrentMeasure ? 'current-measure' : ''}`}>
                                      {note || '-'}
                                    </td>
                                  )) || <td className={`tab-cell ${isCurrentMeasure ? 'current-measure' : ''}`}>-</td>}
                                </React.Fragment>
                              );
                            })}
                            <td className="measure-separator">|</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .tab-viewer.fullscreen-tabs {
          padding: 2rem;
          height: 100vh;
          overflow-y: auto;
        }
        
        .tab-viewer .tab-grid {
          border-collapse: collapse;
          font-family: 'Courier New', Courier, monospace;
          font-size: 14px;
          background: white;
        }
        
        .tab-viewer .tab-grid td {
          padding: 2px 4px;
          height: 24px;
          vertical-align: middle;
          text-align: center;
        }
        
        .tab-viewer .string-label {
          font-weight: bold;
          color: #4b5563;
          padding-right: 8px !important;
          text-align: right !important;
          border-right: 2px solid #000;
        }
        
        .tab-viewer .measure-separator {
          padding: 0 2px !important;
          color: #000;
          font-weight: normal;
        }
        
        .tab-viewer .tab-cell {
          min-width: 20px;
          border-top: 1px solid #d1d5db;
          border-bottom: 1px solid #d1d5db;
        }
        
        .tab-viewer .tab-grid tr:first-child .tab-cell {
          border-top: 2px solid #000;
        }
        
        .tab-viewer .tab-grid tr:last-child .tab-cell {
          border-bottom: 2px solid #000;
        }
        
        .tab-viewer .current-measure {
          background-color: #fbbf24 !important;
          color: #000 !important;
          font-weight: bold;
        }
        
        @media (max-width: 640px) {
          .tab-viewer .tab-grid {
            font-size: 11px;
          }
          
          .tab-viewer .tab-cell {
            min-width: 16px;
            padding: 1px 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default TabViewer;