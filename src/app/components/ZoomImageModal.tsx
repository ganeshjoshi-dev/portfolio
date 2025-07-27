"use client";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-5xl flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="relative w-full h-full"
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
                const maxOffset = (zoomLevel - 1) * 300;
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
          style={{ 
            cursor: isDragging ? 'grabbing' : (zoomLevel > 1 ? 'grab' : 'zoom-in'),
            userSelect: 'none'
          }}
        >
          <div 
            className="relative w-full h-full"
            style={{
              transform: zoomLevel > 1 ? `translate(${position.x}px, ${position.y}px)` : 'none',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <Image
              src={imageSrc}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-contain"
              style={{ 
                transform: `scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out'
              }}
              draggable={false}
              priority
              quality={100}
            />
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-800/50 rounded-full p-2">
          <button
            onClick={e => {
              e.stopPropagation();
              setZoomLevel(prev => Math.max(0.5, prev - 0.25));
            }}
            className="p-2 rounded-full text-white hover:text-cyan-400 transition-all duration-300"
            title="Zoom Out"
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
            className="p-2 rounded-full text-white hover:text-cyan-400 transition-all duration-300"
            title="Zoom In"
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
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-800/50 text-white hover:text-cyan-400 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ZoomImageModal; 