import React, { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, artist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const setAudioTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    // Add multiple event listeners for better compatibility
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('canplay', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('progress', setAudioTime);

    // Set initial values if already loaded
    if (audio.readyState >= 1) {
      setAudioData();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('canplay', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('progress', setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progress = progressRef.current;
    if (!audio || !progress) return;

    const rect = progress.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = 1 - ((e.clientY - rect.top) / rect.height); // Invert because we want top to be max volume
    const newVolume = Math.max(0, Math.min(1, percent));
    
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration && !isNaN(duration) && !isNaN(currentTime) ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
      <audio ref={audioRef} src={src} />
      
      {/* Title and Artist */}
      {(title || artist) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {artist && <p className="text-sm text-gray-600">{artist}</p>}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-xs text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          ref={progressRef}
          className="relative h-3 bg-gray-300 rounded-full cursor-pointer overflow-hidden hover:h-4 transition-all duration-200 shadow-inner"
          onClick={handleProgressChange}
        >
          {/* Progress fill */}
          <div 
            className="absolute h-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-full transition-all duration-100 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume Control */}
          <div className="relative">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Volume"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {volume === 0 ? (
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                ) : volume < 0.5 ? (
                  <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                ) : (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                )}
              </svg>
            </button>
            
            {showVolume && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white rounded-lg shadow-xl border border-gray-200 p-3" style={{ height: '120px', width: '50px' }}>
                <div 
                  className="h-full w-full flex flex-col items-center justify-end relative cursor-pointer"
                  onClick={handleVolumeClick}
                >
                  {/* Volume track background */}
                  <div 
                    className="absolute bottom-3 w-2 bg-gray-300 rounded-full"
                    style={{ height: '84px' }}
                  ></div>
                  {/* Volume fill */}
                  <div 
                    className="absolute bottom-3 w-2 bg-gray-800 rounded-full transition-all duration-150"
                    style={{ height: `${volume * 84}px` }}
                  ></div>
                  {/* Invisible input for drag interaction */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ transform: 'rotate(270deg)' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        <a
          href={src}
          download
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Download"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;