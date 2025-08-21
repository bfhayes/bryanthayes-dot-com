import { useState, useEffect, useRef } from 'react';

export default function TestimonialCarousel({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAutoplay();
    } else {
      stopAutoplay();
    }

    return () => stopAutoplay();
  }, [isPlaying, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 1000);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 1000);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === ' ') {
      event.preventDefault();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Testimonials carousel"
      aria-roledescription="carousel"
    >
      {/* Main testimonial display */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 lg:p-12 min-h-[280px] flex items-center">
        <div className="w-full text-center">
          <blockquote>
            <p className="text-lg lg:text-xl text-neutral-700 leading-relaxed mb-6 italic">
              "{testimonials[currentIndex].quote}"
            </p>
            <footer>
              <cite className="text-brand-700 font-semibold not-italic">
                — {testimonials[currentIndex].author}
              </cite>
              {testimonials[currentIndex].context && (
                <p className="text-sm text-neutral-500 mt-1">
                  {testimonials[currentIndex].context}
                </p>
              )}
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Previous button */}
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full border border-neutral-300 text-neutral-600 hover:text-brand-700 hover:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Previous testimonial"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex space-x-2" role="tablist" aria-label="Testimonial indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-brand-700'
                  : 'bg-neutral-300 hover:bg-brand-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
              type="button"
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="p-3 rounded-full border border-neutral-300 text-neutral-600 hover:text-brand-700 hover:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 transition-colors min-h-[44px] min-w-[44px]"
          aria-label="Next testimonial"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Play/pause button */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-sm text-neutral-500 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 rounded px-2 py-1 transition-colors"
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
          type="button"
        >
          {isPlaying ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              Pause
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </span>
          )}
        </button>
      </div>

      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        Showing testimonial {currentIndex + 1} of {testimonials.length}
      </div>
    </div>
  );
}