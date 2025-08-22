import React, { useState } from 'react';

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  location?: string;
  camera?: string;
  settings?: {
    aperture: string;
    shutter: string;
    iso: number;
  };
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer overflow-hidden rounded-lg bg-ultra-violet/5 hover:shadow-lg transition-all duration-300"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="aspect-w-4 aspect-h-3 overflow-hidden">
              <div className="w-full h-64 bg-gradient-to-br from-pale-dogwood/30 to-rose-quartz/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-3xl opacity-60">📷</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-space-cadet group-hover:text-ultra-violet transition-colors">
                {photo.title}
              </h3>
              {photo.location && (
                <p className="text-sm text-ultra-violet-600 mt-1">{photo.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <div className="flex flex-col lg:flex-row max-h-full">
              <div className="flex-1 flex items-center justify-center">
                <div 
                  className="max-w-full max-h-full bg-gradient-to-br from-pale-dogwood/20 to-rose-quartz/20 rounded-lg flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  style={{ minWidth: '400px', minHeight: '300px' }}
                >
                  <span className="text-6xl opacity-40">📷</span>
                </div>
              </div>

              {/* Image Info */}
              <div 
                className="lg:w-80 bg-white p-6 lg:max-h-full lg:overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-serif font-bold text-space-cadet mb-2">
                  {selectedPhoto.title}
                </h2>
                
                {selectedPhoto.location && (
                  <p className="text-ultra-violet-600 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedPhoto.location}
                  </p>
                )}

                {selectedPhoto.camera && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-space-cadet mb-2">Camera</h3>
                    <p className="text-sm text-ultra-violet-600">{selectedPhoto.camera}</p>
                  </div>
                )}

                {selectedPhoto.settings && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-space-cadet mb-2">Settings</h3>
                    <div className="space-y-1 text-sm text-ultra-violet-600">
                      <p><span className="font-medium">Aperture:</span> {selectedPhoto.settings.aperture}</p>
                      <p><span className="font-medium">Shutter:</span> {selectedPhoto.settings.shutter}</p>
                      <p><span className="font-medium">ISO:</span> {selectedPhoto.settings.iso}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="btn-primary text-sm">
                    Request Print
                  </button>
                  <button className="btn-ghost text-sm">
                    Share
                  </button>
                </div>

                {photos.length > 1 && (
                  <div className="mt-6 pt-4 border-t border-rose-quartz/20">
                    <p className="text-sm text-ultra-violet-600">
                      {currentIndex + 1} of {photos.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}