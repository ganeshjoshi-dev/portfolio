"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ZoomImageModalProps {
  imageSrc: string;
  alt?: string;
  open: boolean;
  onClose: () => void;
}

const ZoomImageModal: React.FC<ZoomImageModalProps> = ({ imageSrc, alt = "Zoomed Image", open, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Get viewport dimensions (90% of viewport for breathing room)
    const updateContainerSize = () => {
      setContainerSize({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.9,
      });
    };
    
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => {
      setMounted(false);
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      
      // Load image to get original dimensions
      const img = document.createElement('img');
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = imageSrc;
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, imageSrc]);

  if (!open || !mounted) return null;

  // Calculate display dimensions
  // At 100% zoom, show original resolution but fit to 90% of viewport if larger
  const getDisplayDimensions = () => {
    if (!imageDimensions.width || !imageDimensions.height) {
      return { width: containerSize.width, height: containerSize.height };
    }

    const imgRatio = imageDimensions.width / imageDimensions.height;
    const containerRatio = containerSize.width / containerSize.height;

    let displayWidth = imageDimensions.width;
    let displayHeight = imageDimensions.height;

    // If image is larger than 90% of viewport, scale it down to fit
    if (imageDimensions.width > containerSize.width || imageDimensions.height > containerSize.height) {
      if (imgRatio > containerRatio) {
        // Image is wider - fit to width
        displayWidth = containerSize.width;
        displayHeight = containerSize.width / imgRatio;
      } else {
        // Image is taller - fit to height
        displayHeight = containerSize.height;
        displayWidth = containerSize.height * imgRatio;
      }
    }

    return { width: displayWidth, height: displayHeight };
  };

  const displayDimensions = getDisplayDimensions();

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="relative pointer-events-auto"
          style={{
            width: displayDimensions.width,
            height: displayDimensions.height,
            cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'zoom-in'),
          }}
          onWheel={e => {
            if (!isDragging) {
              e.preventDefault();
              const delta = e.deltaY * -0.002;
              const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));
              setZoomLevel(newZoom);
            }
          }}
          onClick={e => {
            if (!isDragging) {
              e.stopPropagation();
              if (zoomLevel > 1) {
                setZoomLevel(1);
                setPosition({ x: 0, y: 0 });
              } else {
                setZoomLevel(2);
              }
            }
          }}
          onMouseDown={e => {
            if (zoomLevel > 1) {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
              setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
            }
          }}
          onMouseMove={e => {
            if (isDragging && zoomLevel > 1) {
              e.preventDefault();
              requestAnimationFrame(() => {
                const newX = e.clientX - dragStart.x;
                const newY = e.clientY - dragStart.y;
                const maxOffset = Math.max(displayDimensions.width, displayDimensions.height) * (zoomLevel - 1) * 0.5;
                const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
                const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
                setPosition({ x: boundedX, y: boundedY });
              });
            }
          }}
          onMouseUp={e => {
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
            }
            setIsDragging(false);
          }}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div 
            className="relative w-full h-full select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              transformOrigin: 'center center',
            }}
          >
            <Image
              src={imageSrc}
              alt={alt}
              width={imageDimensions.width || displayDimensions.width}
              height={imageDimensions.height || displayDimensions.height}
              className="w-full h-full object-contain"
              draggable={false}
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-800/50 rounded-full p-2 pointer-events-auto">
          <button
            onClick={e => {
              e.stopPropagation();
              setZoomLevel(prev => Math.max(0.5, prev - 0.25));
            }}
            className="p-2 rounded-full text-white hover:text-cyan-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
            aria-label="Zoom Out"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-white text-sm font-medium">{(zoomLevel * 100).toFixed(0)}%</span>
          <button
            onClick={e => {
              e.stopPropagation();
              setZoomLevel(prev => Math.min(3, prev + 0.25));
            }}
            className="p-2 rounded-full text-white hover:text-cyan-400 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
            aria-label="Zoom In"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800/50 text-white hover:text-cyan-400 transition-all duration-300 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ZoomImageModal; 