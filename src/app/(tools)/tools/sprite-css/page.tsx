'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Upload, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon, Wand2, Grid3X3, Layers, Loader2, SlidersHorizontal } from 'lucide-react';
import { ToolLayout, CodeOutput, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('sprite-css')!;
const category = toolCategories[tool.category];

interface SpriteSelection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageSize {
  width: number;
  height: number;
}

interface PixelData {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

interface DetectedSprite extends SpriteSelection {
  id: string;
}

interface SVGElement {
  id: string;
  name: string;
  bounds: SpriteSelection;
  element: Element;
}

const backgroundColors = [
  { id: 'transparent', label: 'Transparent', class: 'checkerboard-bg' },
  { id: 'transparent-light', label: 'Transparent (Light)', class: 'checkerboard-bg-light' },
  { id: 'white', label: 'White', class: 'bg-white' },
  { id: 'black', label: 'Black', class: 'bg-black' },
  { id: 'slate', label: 'Slate', class: 'bg-slate-600' },
];

// Helper function to check if a pixel is non-transparent
const isOpaquePixel = (data: Uint8ClampedArray, index: number, threshold: number = 10): boolean => {
  return data[index + 3] > threshold;
};

// Fast sprite detection using a simple click-based flood fill (only for the clicked area)
const findSpriteBoundsAtPoint = (
  pixelData: PixelData,
  clickX: number,
  clickY: number,
  gapTolerance: number = 3
): SpriteSelection | null => {
  const { data, width, height } = pixelData;

  const isOpaque = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const index = (y * width + x) * 4;
    return isOpaquePixel(data, index);
  };

  // Find starting point (search nearby if clicked on transparent)
  let startX = clickX;
  let startY = clickY;
  let foundStart = isOpaque(clickX, clickY);

  if (!foundStart) {
    const searchRadius = Math.min(gapTolerance * 2, 10);
    outer: for (let r = 1; r <= searchRadius; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (isOpaque(clickX + dx, clickY + dy)) {
            startX = clickX + dx;
            startY = clickY + dy;
            foundStart = true;
            break outer;
          }
        }
      }
    }
  }

  if (!foundStart) return null;

  // Use Uint8Array for visited tracking (much faster than Set for large images)
  const visited = new Uint8Array(width * height);
  const queue: number[] = [startX, startY]; // Flat array is faster than array of tuples
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  
  const gap = gapTolerance + 1;

  while (queue.length > 0) {
    const y = queue.pop()!;
    const x = queue.pop()!;
    const idx = y * width + x;

    if (visited[idx]) continue;
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (!isOpaque(x, y)) continue;

    visited[idx] = 1;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    // Add neighbors with gap tolerance (check in a grid pattern for efficiency)
    for (let dy = -gap; dy <= gap; dy += Math.max(1, Math.floor(gap / 2))) {
      for (let dx = -gap; dx <= gap; dx += Math.max(1, Math.floor(gap / 2))) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (!visited[nidx] && isOpaque(nx, ny)) {
            queue.push(nx, ny);
          }
        }
      }
    }
    
    // Also check immediate 8 neighbors for complete coverage
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = ny * width + nx;
          if (!visited[nidx] && isOpaque(nx, ny)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  const spriteWidth = maxX - minX + 1;
  const spriteHeight = maxY - minY + 1;
  
  if (spriteWidth < 3 || spriteHeight < 3) return null;

  return {
    x: minX,
    y: minY,
    width: spriteWidth,
    height: spriteHeight,
  };
};

// Scan for sprites using a grid-based sampling approach (much faster than pixel-by-pixel)
const detectSpritesAsync = (
  pixelData: PixelData,
  gapTolerance: number,
  onProgress: (progress: number) => void,
  onComplete: (sprites: DetectedSprite[]) => void
): (() => void) => {
  const { data, width, height } = pixelData;
  const sprites: DetectedSprite[] = [];
  const visited = new Uint8Array(width * height);
  
  const isOpaque = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    const index = (y * width + x) * 4;
    return isOpaquePixel(data, index);
  };

  // Sample at intervals to find sprites faster
  const sampleStep = Math.max(2, Math.floor(Math.min(width, height) / 200));
  const totalSamples = Math.ceil(height / sampleStep) * Math.ceil(width / sampleStep);
  let samplesProcessed = 0;
  let cancelled = false;

  const processChunk = (startY: number) => {
    if (cancelled) return;
    
    const endY = Math.min(startY + sampleStep * 10, height);
    
    for (let y = startY; y < endY; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        samplesProcessed++;
        
        const idx = y * width + x;
        if (visited[idx] || !isOpaque(x, y)) continue;

        // Found an unvisited opaque pixel - do a bounded flood fill
        const queue: number[] = [x, y];
        let minX = x, maxX = x, minY = y, maxY = y;
        let pixelCount = 0;
        const maxPixels = 50000; // Limit to prevent hanging on huge sprites

        while (queue.length > 0 && pixelCount < maxPixels) {
          const py = queue.pop()!;
          const px = queue.pop()!;
          const pidx = py * width + px;

          if (visited[pidx]) continue;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          if (!isOpaque(px, py)) continue;

          visited[pidx] = 1;
          pixelCount++;

          minX = Math.min(minX, px);
          maxX = Math.max(maxX, px);
          minY = Math.min(minY, py);
          maxY = Math.max(maxY, py);

          // Check neighbors with gap tolerance
          const gap = gapTolerance + 1;
          for (let dy = -gap; dy <= gap; dy++) {
            for (let dx = -gap; dx <= gap; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = px + dx;
              const ny = py + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const nidx = ny * width + nx;
                if (!visited[nidx] && isOpaque(nx, ny)) {
                  queue.push(nx, ny);
                }
              }
            }
          }
        }

        const spriteWidth = maxX - minX + 1;
        const spriteHeight = maxY - minY + 1;

        if (spriteWidth > 5 && spriteHeight > 5 && pixelCount > 10) {
          sprites.push({
            id: `sprite-${sprites.length}`,
            x: minX,
            y: minY,
            width: spriteWidth,
            height: spriteHeight,
          });
        }
      }
    }

    onProgress(Math.min(100, Math.round((samplesProcessed / totalSamples) * 100)));

    if (endY < height && !cancelled) {
      requestAnimationFrame(() => processChunk(endY));
    } else if (!cancelled) {
      // Sort sprites by position
      sprites.sort((a, b) => {
        const rowA = Math.floor(a.y / 50);
        const rowB = Math.floor(b.y / 50);
        if (rowA !== rowB) return rowA - rowB;
        return a.x - b.x;
      });
      onComplete(sprites);
    }
  };

  requestAnimationFrame(() => processChunk(0));

  return () => { cancelled = true; };
};

// Parse SVG and extract individual elements
const parseSVGElements = (svgContent: string): SVGElement[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return [];

    const elements: SVGElement[] = [];
    
    // Get viewBox for coordinate reference
    const viewBox = svg.getAttribute('viewBox');
    let vbWidth = 0, vbHeight = 0;
    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      vbWidth = parts[2] || 0;
      vbHeight = parts[3] || 0;
    }

    // Look for symbols, groups with IDs, or individual shapes
    const selectableElements = svg.querySelectorAll('symbol, g[id], path[id], rect[id], circle[id]');

    selectableElements.forEach((el, index) => {
      const bbox = getBBoxFromElement(el, vbWidth, vbHeight);
      if (bbox && bbox.width > 1 && bbox.height > 1) {
        elements.push({
          id: el.id || `element-${index}`,
          name: el.id || `${el.tagName} ${index + 1}`,
          bounds: bbox,
          element: el,
        });
      }
    });

    return elements;
  } catch {
    return [];
  }
};

// Get bounding box from SVG element
const getBBoxFromElement = (el: Element, vbWidth: number, vbHeight: number): SpriteSelection | null => {
  try {
    const x = parseFloat(el.getAttribute('x') || '0');
    const y = parseFloat(el.getAttribute('y') || '0');
    const width = parseFloat(el.getAttribute('width') || '0');
    const height = parseFloat(el.getAttribute('height') || '0');

    if (width > 0 && height > 0) {
      return { x, y, width, height };
    }

    // For viewBox-based elements
    const viewBox = el.getAttribute('viewBox');
    if (viewBox) {
      const [vx, vy, vw, vh] = viewBox.split(/\s+/).map(Number);
      return { x: vx || 0, y: vy || 0, width: vw || vbWidth, height: vh || vbHeight };
    }

    return null;
  } catch {
    return null;
  }
};

export default function SpriteCSSPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [selection, setSelection] = useState<SpriteSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [outputTab, setOutputTab] = useState('css');
  const [zoom, setZoom] = useState(1);
  const [bgColor, setBgColor] = useState('transparent');
  const [isDragging, setIsDragging] = useState(false);
  const [smartSelect, setSmartSelect] = useState(true);
  const [pixelData, setPixelData] = useState<PixelData | null>(null);
  const [detectedSprites, setDetectedSprites] = useState<DetectedSprite[]>([]);
  const [svgElements, setSvgElements] = useState<SVGElement[]>([]);
  const [isSVG, setIsSVG] = useState(false);
  const [showSpritePanel, setShowSpritePanel] = useState(false);
  const [gapTolerance, setGapTolerance] = useState(5);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectProgress, setDetectProgress] = useState(0);
  const [bgOpacity, setBgOpacity] = useState(100);
  const [showBgOpacityPopover, setShowBgOpacityPopover] = useState(false);
  const [showGapPopover, setShowGapPopover] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const cancelDetectionRef = useRef<(() => void) | null>(null);
  const bgOpacityPopoverRef = useRef<HTMLDivElement>(null);
  const gapPopoverRef = useRef<HTMLDivElement>(null);

  // Close toolbar popovers on outside click
  useEffect(() => {
    if (!showBgOpacityPopover && !showGapPopover) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInBg = bgOpacityPopoverRef.current?.contains(target);
      const clickedInGap = gapPopoverRef.current?.contains(target);

      if (!clickedInBg && !clickedInGap) {
        setShowBgOpacityPopover(false);
        setShowGapPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBgOpacityPopover, showGapPopover]);

  // Handle file drop/upload
  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Cancel any ongoing detection
      if (cancelDetectionRef.current) {
        cancelDetectionRef.current();
        cancelDetectionRef.current = null;
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setSelection(null);
      setZoom(1);
      setDetectedSprites([]);
      setSvgElements([]);
      setShowSpritePanel(false);
      setIsDetecting(false);
      setPixelData(null);
      setImageSize(null);

      // Check if it's an SVG
      if (file.type === 'image/svg+xml') {
        setIsSVG(true);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            const elements = parseSVGElements(content);
            setSvgElements(elements);
            if (elements.length > 0) {
              setShowSpritePanel(true);
            }
          }
        };
        reader.readAsText(file);
      } else {
        setIsSVG(false);
      }
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (imageRef.current && hiddenCanvasRef.current) {
      const img = imageRef.current;
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      setImageSize({ width, height });

      const canvas = hiddenCanvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const imageData = ctx.getImageData(0, 0, width, height);
          setPixelData({
            data: imageData.data,
            width,
            height,
          });
        } catch {
          setPixelData(null);
        }
      }
    }
  }, []);

  // Detect sprites on demand
  const handleDetectSprites = useCallback(() => {
    if (!pixelData || isDetecting) return;

    setIsDetecting(true);
    setDetectProgress(0);
    setDetectedSprites([]);

    cancelDetectionRef.current = detectSpritesAsync(
      pixelData,
      gapTolerance,
      setDetectProgress,
      (sprites) => {
        setDetectedSprites(sprites);
        setIsDetecting(false);
        setShowSpritePanel(true);
        cancelDetectionRef.current = null;
      }
    );
  }, [pixelData, gapTolerance, isDetecting]);

  // Cleanup detection on unmount
  useEffect(() => {
    return () => {
      if (cancelDetectionRef.current) {
        cancelDetectionRef.current();
      }
    };
  }, []);

  // Selection handlers
  const getMousePosition = useCallback((e: React.MouseEvent): { x: number; y: number } | null => {
    if (!canvasRef.current || !imageSize) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / zoom);
    const y = Math.round((e.clientY - rect.top) / zoom);

    return {
      x: Math.max(0, Math.min(x, imageSize.width)),
      y: Math.max(0, Math.min(y, imageSize.height)),
    };
  }, [zoom, imageSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageUrl) return;
    const pos = getMousePosition(e);
    if (!pos) return;

    // Try smart selection first
    if (smartSelect && pixelData) {
      const bounds = findSpriteBoundsAtPoint(pixelData, pos.x, pos.y, gapTolerance);
      if (bounds) {
        setSelection(bounds);
        return;
      }
    }

    // Fall back to manual drag selection
    setIsSelecting(true);
    setStartPoint(pos);
    setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
  }, [imageUrl, getMousePosition, smartSelect, pixelData, gapTolerance]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSelecting || !startPoint) return;
    const pos = getMousePosition(e);
    if (!pos) return;

    const x = Math.min(startPoint.x, pos.x);
    const y = Math.min(startPoint.y, pos.y);
    const width = Math.abs(pos.x - startPoint.x);
    const height = Math.abs(pos.y - startPoint.y);

    setSelection({ x, y, width, height });
  }, [isSelecting, startPoint, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setStartPoint(null);
  }, []);

  // Ensure scroll wheel/touchpad scrolling only moves the image area (not the page)
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    // Always prevent page scroll while cursor is over the image area
    e.preventDefault();
    e.stopPropagation();

    // Manually scroll the image container
    container.scrollTop += e.deltaY;
    container.scrollLeft += e.deltaX;
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 0.25, 4)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 0.25, 0.25)), []);
  const handleReset = useCallback(() => {
    setZoom(1);
    setSelection(null);
  }, []);

  // Handle sprite selection from panel
  const handleSpriteClick = useCallback((sprite: DetectedSprite | SVGElement) => {
    if ('bounds' in sprite) {
      setSelection(sprite.bounds);
    } else {
      setSelection({ x: sprite.x, y: sprite.y, width: sprite.width, height: sprite.height });
    }
  }, []);

  // Generate CSS output
  const cssOutput = useMemo(() => {
    if (!selection || selection.width === 0 || selection.height === 0) {
      return '/* Select a sprite region to generate CSS */';
    }

    return `.sprite {
  background-image: url('your-sprite.png');
  background-position: -${selection.x}px -${selection.y}px;
  width: ${selection.width}px;
  height: ${selection.height}px;
  background-repeat: no-repeat;
}`;
  }, [selection]);

  // Generate Tailwind output
  const tailwindOutput = useMemo(() => {
    if (!selection || selection.width === 0 || selection.height === 0) {
      return '/* Select a sprite region to generate Tailwind classes */';
    }

    return `{/* Tailwind CSS classes for your sprite */}
<div
  style={{ backgroundImage: "url('your-sprite.png')" }}
  className="
    bg-[-${selection.x}px_-${selection.y}px]
    w-[${selection.width}px]
    h-[${selection.height}px]
    bg-no-repeat
  "
/>

{/* Or use inline style for background-position too: */}
<div
  style={{
    backgroundImage: "url('your-sprite.png')",
    backgroundPosition: '-${selection.x}px -${selection.y}px',
    width: '${selection.width}px',
    height: '${selection.height}px',
    backgroundRepeat: 'no-repeat'
  }}
/>`;
  }, [selection]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const selectedBg = backgroundColors.find((bg) => bg.id === bgColor) || backgroundColors[0];
  const hasDetectedSprites = detectedSprites.length > 0 || svgElements.length > 0;

  return (
    <ToolLayout
      title="Sprite CSS Generator"
      description="Upload a spritesheet, select a sprite region, and get the exact CSS code to display it."
      tool={tool}
      category={category}
    >
      {/* Hidden canvas for pixel data extraction */}
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="space-y-6">
        {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2">
            {/* Upload button */}
            {imageUrl && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300"
                >
                  <Upload className="w-4 h-4" />
                  Upload New
                </button>
                <div className="w-px h-6 bg-slate-700/60 mx-2" />
              </>
            )}

            {/* Zoom controls */}
            <button
              onClick={handleZoomOut}
              disabled={!imageUrl || zoom <= 0.25}
              className="p-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-400 min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={!imageUrl || zoom >= 4}
              className="p-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              disabled={!imageUrl}
              className="p-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-x-3 gap-y-2 flex-wrap md:flex-nowrap">
            {/* Smart Select Toggle */}
            <button
              onClick={() => setSmartSelect(!smartSelect)}
              disabled={!pixelData}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                smartSelect && pixelData
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
              } ${!pixelData ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Click on a sprite to auto-select it"
            >
              <Wand2 className="w-4 h-4" />
              Smart Select
            </button>

            {/* Gap Tolerance Slider */}
            {imageUrl && pixelData && (
              <div className="relative" ref={gapPopoverRef}>
                <button
                  type="button"
                  onClick={() => setShowGapPopover((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm text-slate-400 border border-slate-600/70 bg-slate-800/80 hover:text-cyan-300 hover:border-cyan-400/60 transition-colors"
                  title="Adjust gap tolerance for sprite detection"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span className="hidden sm:inline whitespace-nowrap">Gap</span>
                  <span className="sm:hidden whitespace-nowrap">{gapTolerance}px</span>
                </button>

                {showGapPopover && (
                  <div className="absolute right-0 mt-2 z-20 px-3 py-2 rounded-lg bg-slate-900/95 border border-slate-700/80 shadow-lg flex items-center gap-2">
                    <span className="text-xs text-slate-400 whitespace-nowrap">Gap</span>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={gapTolerance}
                      onChange={(e) => setGapTolerance(Number(e.target.value))}
                      className="w-28 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                        [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      title="Gap tolerance for connecting nearby sprite parts"
                    />
                    <span className="text-xs text-slate-300 min-w-[3rem] text-right tabular-nums">
                      {gapTolerance}px
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Detect Sprites Button */}
            {imageUrl && pixelData && !isSVG && (
              <button
                onClick={handleDetectSprites}
                disabled={isDetecting}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isDetecting
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-cyan-300 hover:border-cyan-400/50'
                }`}
                title="Scan image to detect all sprites"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {detectProgress}%
                  </>
                ) : (
                  <>
                    <Grid3X3 className="w-4 h-4" />
                    Detect All
                  </>
                )}
              </button>
            )}

            {/* Sprite Panel Toggle */}
            {hasDetectedSprites && (
              <button
                onClick={() => setShowSpritePanel(!showSpritePanel)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  showSpritePanel
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
                }`}
                title="Show/hide detected sprites panel"
              >
                <Layers className="w-4 h-4" />
                Sprites ({isSVG ? svgElements.length : detectedSprites.length})
              </button>
            )}

            {/* Background Color Selector */}
            {imageUrl && (
              <div className="flex items-center gap-x-3 gap-y-2 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Background:</span>
                  <div className="flex gap-1">
                    {backgroundColors.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setBgColor(bg.id)}
                        className={`w-6 h-6 rounded border-2 transition-all duration-300 ${bg.class} ${
                          bgColor === bg.id
                            ? 'border-cyan-400 ring-2 ring-cyan-400/30'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                        title={bg.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Opacity (only applies to transparent backgrounds) */}
                {(bgColor === 'transparent' || bgColor === 'transparent-light') && (
                  <div className="relative" ref={bgOpacityPopoverRef}>
                    <button
                      type="button"
                      onClick={() => setShowBgOpacityPopover((prev) => !prev)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs sm:text-sm text-slate-400 border border-slate-600/70 bg-slate-800/80 hover:text-cyan-300 hover:border-cyan-400/60 transition-colors"
                      title="Adjust checkerboard background opacity"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span className="hidden sm:inline whitespace-nowrap">BG opacity</span>
                      <span className="sm:hidden whitespace-nowrap">{bgOpacity}%</span>
                    </button>

                    {showBgOpacityPopover && (
                      <div className="absolute right-0 mt-2 z-20 px-3 py-2 rounded-lg bg-slate-900/95 border border-slate-700/80 shadow-lg flex items-center gap-2">
                        <span className="text-xs text-slate-400 whitespace-nowrap">BG opacity</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bgOpacity}
                          onChange={(e) => setBgOpacity(Number(e.target.value))}
                          className="w-28 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                        />
                        <span className="text-xs text-slate-300 min-w-[3rem] text-right tabular-nums">
                          {bgOpacity}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`grid gap-6 ${showSpritePanel && hasDetectedSprites ? 'lg:grid-cols-[1fr_280px]' : ''}`}>
          {/* Canvas / Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onWheelCapture={handleWheel}
            className={`
              relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-auto
              ${imageUrl ? 'max-h-[50vh] min-h-[300px]' : 'min-h-[400px]'}
              ${isDragging ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-700/60 bg-slate-800/40'}
              ${!imageUrl ? 'flex items-center justify-center' : ''}
            `}
          >
            {!imageUrl ? (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 mb-6">
                  <ImageIcon className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-300 text-lg mb-2">Drag and drop your spritesheet here</p>
                <p className="text-slate-500 text-sm mb-6">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300 text-lg"
                >
                  <Upload className="w-5 h-5" />
                  Browse Files
                </button>
                <p className="text-slate-500 text-sm mt-6">
                  Supports PNG, JPEG, SVG, WebP
                </p>
              </div>
            ) : (
              <div
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`relative cursor-crosshair select-none ${selectedBg.class}`}
                style={{
                  minWidth: '100%',
                  width: imageSize ? imageSize.width * zoom : 'auto',
                  height: imageSize ? imageSize.height * zoom : 'auto',
                  ['--checkerboard-opacity' as `--${string}`]: `${bgOpacity / 100}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Spritesheet"
                  onLoad={handleImageLoad}
                  className="block pointer-events-none"
                  crossOrigin="anonymous"
                  style={{
                    width: imageSize ? imageSize.width * zoom : 'auto',
                    height: imageSize ? imageSize.height * zoom : 'auto',
                    imageRendering: zoom > 1 ? 'pixelated' : 'auto',
                  }}
                  draggable={false}
                />

                {/* Selection Overlay */}
                {selection && selection.width > 0 && selection.height > 0 && (
                  <>
                    <div
                      className="absolute inset-0 bg-black/40 pointer-events-none"
                      style={{
                        clipPath: `polygon(
                          0% 0%, 
                          0% 100%, 
                          ${selection.x * zoom}px 100%, 
                          ${selection.x * zoom}px ${selection.y * zoom}px, 
                          ${(selection.x + selection.width) * zoom}px ${selection.y * zoom}px, 
                          ${(selection.x + selection.width) * zoom}px ${(selection.y + selection.height) * zoom}px, 
                          ${selection.x * zoom}px ${(selection.y + selection.height) * zoom}px, 
                          ${selection.x * zoom}px 100%, 
                          100% 100%, 
                          100% 0%
                        )`,
                      }}
                    />
                    <div
                      className="absolute border-2 border-cyan-400 pointer-events-none"
                      style={{
                        left: selection.x * zoom,
                        top: selection.y * zoom,
                        width: selection.width * zoom,
                        height: selection.height * zoom,
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 217, 255, 0.3)',
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Detected Sprites Panel */}
          {showSpritePanel && hasDetectedSprites && imageUrl && (
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/60 overflow-hidden">
              <div className="p-3 border-b border-slate-700/60 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-300">
                  {isSVG ? 'SVG Elements' : 'Detected Sprites'}
                </h3>
                <span className="text-xs text-slate-500">
                  ({isSVG ? svgElements.length : detectedSprites.length})
                </span>
              </div>
              <div className="p-2 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {isSVG
                    ? svgElements.map((el) => (
                        <button
                          key={el.id}
                          onClick={() => handleSpriteClick(el)}
                          className={`aspect-square rounded-lg border-2 transition-all duration-200 p-1 flex items-center justify-center overflow-hidden ${
                            selection?.x === el.bounds.x && selection?.y === el.bounds.y
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                          }`}
                          title={el.name}
                        >
                          <span className="text-[10px] text-slate-400 text-center truncate">
                            {el.name}
                          </span>
                        </button>
                      ))
                    : detectedSprites.map((sprite) => (
                        <button
                          key={sprite.id}
                          onClick={() => handleSpriteClick(sprite)}
                          className={`aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                            selection?.x === sprite.x && selection?.y === sprite.y
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                          }`}
                          title={`${sprite.width}x${sprite.height} at (${sprite.x}, ${sprite.y})`}
                        >
                          {imageUrl && imageSize && (
                            <div
                              className="w-full h-full"
                              style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundPosition: `-${sprite.x * (40 / Math.max(sprite.width, sprite.height))}px -${sprite.y * (40 / Math.max(sprite.width, sprite.height))}px`,
                                backgroundSize: `${imageSize.width * (40 / Math.max(sprite.width, sprite.height))}px ${imageSize.height * (40 / Math.max(sprite.width, sprite.height))}px`,
                                backgroundRepeat: 'no-repeat',
                              }}
                            />
                          )}
                        </button>
                      ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selection Info & Image Info */}
          <div className="space-y-4">
            {selection && selection.width > 0 && selection.height > 0 ? (
              <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/60">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Selection Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">X:</span>
                    <span className="ml-2 text-cyan-300">{selection.x}px</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Y:</span>
                    <span className="ml-2 text-cyan-300">{selection.y}px</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Width:</span>
                    <span className="ml-2 text-cyan-300">{selection.width}px</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Height:</span>
                    <span className="ml-2 text-cyan-300">{selection.height}px</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/60">
                <h3 className="text-sm font-medium text-slate-300 mb-3">How to Use</h3>
                <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
                  <li>Upload your spritesheet image (drag & drop or click Browse Files)</li>
                  <li>
                    {smartSelect && pixelData
                      ? 'Click on a sprite to auto-select it, or drag to manually select'
                      : 'Click and drag on the image to select a sprite region'}
                  </li>
                  <li>Use &quot;Detect All&quot; to find all sprites, then click thumbnails to select</li>
                  <li>Copy the generated CSS code</li>
                </ol>
              </div>
            )}

            {/* Image Info */}
            {imageSize && (
              <div className="text-sm text-slate-500 px-1">
                Image size: {imageSize.width} × {imageSize.height} pixels
                {detectedSprites.length > 0 && (
                  <span className="ml-2 text-cyan-400/60">• {detectedSprites.length} sprites found</span>
                )}
                {isSVG && svgElements.length > 0 && (
                  <span className="ml-2 text-emerald-400/60">• SVG with {svgElements.length} elements</span>
                )}
              </div>
            )}
          </div>

          {/* Output Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Output</h3>
              <TabSwitcher
                options={[
                  { id: 'css', label: 'CSS' },
                  { id: 'tailwind', label: 'Tailwind' },
                ]}
                activeTab={outputTab}
                onChange={setOutputTab}
              />
            </div>
            <CodeOutput
              code={outputTab === 'css' ? cssOutput : tailwindOutput}
              language={outputTab === 'css' ? 'css' : 'jsx'}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
