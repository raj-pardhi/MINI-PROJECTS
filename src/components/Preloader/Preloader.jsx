import React, { useState, useEffect } from 'react';
import './preloader.css';

// If you have individual dog images, import them here
// import dog1 from './assets/dog-1.png';
// import dog2 from './assets/dog-2.png';
// ... etc

const DogImagePreloader = ({ 
  isLoading = true, 
  onComplete,
  dogImages = [], // Array of image paths or imported images
  useSpriteSheet = true, // Use sprite sheet or individual images
  spriteSheetPath = '/assets/dog.png'
}) => {
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const totalFrames = useSpriteSheet ? 16 : dogImages.length;

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  useEffect(() => {
    const frame = Math.floor((progress / 100) * (totalFrames - 1));
    setCurrentFrame(Math.min(frame, totalFrames - 1));
  }, [progress, totalFrames]);

  if (!isLoading && progress >= 100) {
    return null;
  }

  return (
    <div className="dog-image-preloader">
      <div className="dog-image-container">
        
        {/* Dog Image/Frame Display */}
        <div className="dog-image-wrapper">
          {useSpriteSheet ? (
            // Sprite Sheet Mode
            <div 
              className="dog-sprite-frame"
              style={{
                backgroundImage: `url(${spriteSheetPath})`,
                backgroundPosition: `${(currentFrame / (totalFrames - 1)) * 100}% 0%`
              }}
            />
          ) : (
            // Individual Images Mode
            <img 
              src={dogImages[currentFrame]} 
              alt={`Loading frame ${currentFrame + 1}`}
              className="dog-individual-frame"
            />
          )}
        </div>

        {/* Loading Info */}
        <div className="image-loading-info">
          <h2>Loading...</h2>
          <div className="frame-indicator">
            <span className="current-frame">{currentFrame + 1}</span>
            <span className="separator">/</span>
            <span className="total-frames">{totalFrames}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="image-progress-section">
          <div className="image-progress-bar">
            <div 
              className="image-progress-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          <div className="image-progress-percentage">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Frame Dots Indicator */}
        <div className="frame-dots">
          {Array.from({ length: totalFrames }).map((_, index) => (
            <div 
              key={index}
              className={`frame-dot ${index <= currentFrame ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DogImagePreloader;