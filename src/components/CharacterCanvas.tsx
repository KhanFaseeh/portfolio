import React, { useEffect, useRef, useState } from 'react';
import { lerpAngle, angleToFrameIndex, radToDeg, getCompassDirection } from '../utils/math';
import { sounds } from '../utils/audio';

export interface TelemetryData {
  fps: number;
  angleDeg: number;
  angleRad: number;
  frameIndex: number;
  isEyeContact: boolean;
  compass: { code: string; name: string };
  isLoaded: boolean;
  loadProgress: number;
}

interface CharacterCanvasProps {
  onTelemetryUpdate?: (data: TelemetryData) => void;
  showDeadzoneVisualizer?: boolean;
  activeCompassTarget?: number | null;
  onClearCompassTarget?: () => void;
  isPaused?: boolean;
}

const TOTAL_FRAMES = 64;
const DEADZONE_SCREEN_PERCENT = 0.12; // 12% screen radius deadzone
const LERP_FACTOR = 0.26; // ~35ms response factor for ultra-smooth tracking

export const CharacterCanvas: React.FC<CharacterCanvasProps> = ({
  onTelemetryUpdate,
  showDeadzoneVisualizer = false,
  activeCompassTarget = null,
  onClearCompassTarget,
  isPaused = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pre-decoded frame assets (ImageBitmap or pre-decoded HTMLImageElement)
  const framesRef = useRef<HTMLImageElement[]>([]);
  const centerImageRef = useRef<HTMLImageElement | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cursor position in mutable ref (zero React overhead)
  const cursorRef = useRef<{ x: number; y: number; isInside: boolean }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    isInside: false,
  });

  const stateRef = useRef<{
    currentAngle: number;
    targetAngle: number;
    currentFrameIndex: number;
    isEyeContact: boolean;
    lastEyeContactState: boolean;
    frameCount: number;
    fps: number;
    fpsTimer: number;
    telemetryTimer: number;
    idleTimer: number;
    lastDrawnFrame: number;
    lastDrawnEyeContact: boolean;
  }>({
    currentAngle: 0,
    targetAngle: 0,
    currentFrameIndex: 0,
    isEyeContact: true,
    lastEyeContactState: true,
    frameCount: 0,
    fps: 60,
    fpsTimer: performance.now(),
    telemetryTimer: performance.now(),
    idleTimer: performance.now(),
    lastDrawnFrame: -1,
    lastDrawnEyeContact: false,
  });

  const layoutRef = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    dpr: 1,
    drawW: 1920,
    drawH: 1080,
    drawX: 0,
    drawY: 0,
    faceScreenX: 960,
    faceScreenY: 345,
    deadzoneRadius: 100,
  });

  // Calculate layout metrics on resize rather than every frame
  useEffect(() => {
    const updateLayout = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      // Clamp DPR to max 1.25 for full-screen cover to eliminate 4K fill-rate bottleneck
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      const targetCanvasW = Math.round(width * dpr);
      const targetCanvasH = Math.round(height * dpr);

      if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
        canvas.width = targetCanvasW;
        canvas.height = targetCanvasH;
        stateRef.current.lastDrawnFrame = -1; // Force redraw on resize
      }

      const imgAspect = 1920 / 1080;
      const canvasAspect = canvas.width / canvas.height;

      let drawW = canvas.width;
      let drawH = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (canvasAspect > imgAspect) {
        drawW = canvas.width;
        drawH = canvas.width / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * imgAspect;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      }

      const faceScreenX = (drawX + drawW * 0.50) / dpr;
      const faceScreenY = (drawY + drawH * 0.32) / dpr;
      const screenDim = Math.min(width, height);
      const deadzoneRadius = screenDim * DEADZONE_SCREEN_PERCENT;

      layoutRef.current = {
        width,
        height,
        dpr,
        drawW,
        drawH,
        drawX,
        drawY,
        faceScreenX,
        faceScreenY,
        deadzoneRadius,
      };
    };

    updateLayout();
    window.addEventListener('resize', updateLayout, { passive: true });
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Preload and fully PRE-DECODE all 64 directional frames + center.webp (DESKTOP ONLY)
  useEffect(() => {
    // If on mobile / small screen, don't download, pre-decode or keep 65 frames in memory
    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
    );
    if (isMobile) {
      return;
    }

    let mounted = true;
    let loadedCount = 0;
    const totalToLoad = TOTAL_FRAMES + 1;

    const frameImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onImageReady = () => {
      if (!mounted) return;
      loadedCount++;
      const progress = Math.round((loadedCount / totalToLoad) * 100);
      setLoadProgress(progress);

      if (loadedCount === totalToLoad) {
        framesRef.current = frameImages;
        setIsLoaded(true);
      }
    };

    const loadAndDecode = async (img: HTMLImageElement, src: string) => {
      img.src = src;
      try {
        if ('decode' in img) {
          await img.decode();
        } else {
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }
      } catch {
        // Fallback for decode rejection
      }
      onImageReady();
    };

    // Preload & decode center image
    const centerImg = new Image();
    loadAndDecode(centerImg, '/frames/center.webp');
    centerImageRef.current = centerImg;

    // Preload & decode 64 directional frames in parallel
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const filename = `/frames/frame_${String(i).padStart(2, '0')}.webp`;
      loadAndDecode(img, filename);
      frameImages[i] = img;
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Pointer event listeners (passive, minimal CPU)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Ignore touch events to disable tracking on mobile
      if (e.pointerType === 'touch') return;

      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      cursorRef.current.isInside = true;
      stateRef.current.idleTimer = performance.now();

      if (activeCompassTarget !== null && onClearCompassTarget) {
        onClearCompassTarget();
      }
    };

    const handlePointerLeave = () => {
      cursorRef.current.isInside = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [activeCompassTarget, onClearCompassTarget]);

  // Strict 60 FPS RequestAnimationFrame Render Loop
  useEffect(() => {
    if (!isLoaded || isPaused) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Optimize canvas 2D context image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

    const render = (now: number) => {
      // FPS measurement
      stateRef.current.frameCount++;
      if (now - stateRef.current.fpsTimer >= 500) {
        stateRef.current.fps = Math.round(
          (stateRef.current.frameCount * 1000) / (now - stateRef.current.fpsTimer)
        );
        stateRef.current.frameCount = 0;
        stateRef.current.fpsTimer = now;
      }

      const metrics = layoutRef.current;
      const faceScreenX = metrics.faceScreenX;
      const faceScreenY = metrics.faceScreenY;
      const deadzoneRadius = metrics.deadzoneRadius;
      const drawX = metrics.drawX;
      const drawY = metrics.drawY;
      const drawW = metrics.drawW;
      const drawH = metrics.drawH;
      const dpr = metrics.dpr;

      let targetAngle = stateRef.current.targetAngle;
      let inDeadzone = false;

      if (activeCompassTarget !== null) {
        targetAngle = (activeCompassTarget / TOTAL_FRAMES) * (2 * Math.PI);
        inDeadzone = false;
      } else if (!cursorRef.current.isInside && now - stateRef.current.idleTimer > 3500) {
        const t = (now - stateRef.current.idleTimer) * 0.001;
        targetAngle = Math.sin(t * 0.7) * 0.45;
        inDeadzone = Math.sin(t * 0.4) > 0.4;
      } else {
        const dx = cursorRef.current.x - faceScreenX;
        const dy = cursorRef.current.y - faceScreenY;
        const dist = Math.hypot(dx, dy);

        if (dist <= deadzoneRadius) {
          inDeadzone = true;
        } else {
          inDeadzone = false;
          targetAngle = Math.atan2(dy, dx);
        }
      }

      // Shortest-path circular angular lerp (k = 0.26, ~35ms lag-free)
      stateRef.current.currentAngle = lerpAngle(
        stateRef.current.currentAngle,
        targetAngle,
        LERP_FACTOR
      );

      // Map smoothed angle to discrete frame index (0..63)
      const frameIndex = angleToFrameIndex(stateRef.current.currentAngle, TOTAL_FRAMES);
      stateRef.current.currentFrameIndex = frameIndex;
      stateRef.current.isEyeContact = inDeadzone;

      // Broadcast eye-contact change directly to cursor via custom event (ZERO React re-renders)
      if (inDeadzone !== stateRef.current.lastEyeContactState) {
        stateRef.current.lastEyeContactState = inDeadzone;
        window.dispatchEvent(new CustomEvent('hero-eye-contact', { detail: inDeadzone }));
        if (inDeadzone) {
          sounds.playEyeContact();
        }
      }

      // DIRTY-CHECK RENDERING: Only redraw when frame index or eye-contact changed, or visualizer is active
      const needsRedraw =
        frameIndex !== stateRef.current.lastDrawnFrame ||
        inDeadzone !== stateRef.current.lastDrawnEyeContact ||
        showDeadzoneVisualizer;

      if (needsRedraw) {
        ctx.globalAlpha = 1.0;

        const activeImage = inDeadzone
          ? centerImageRef.current
          : framesRef.current[frameIndex];

        if (activeImage && activeImage.complete && activeImage.naturalWidth > 0) {
          ctx.drawImage(activeImage, drawX, drawY, drawW, drawH);
        }

        // Optional Deadzone Visualizer HUD
        if (showDeadzoneVisualizer) {
          ctx.save();
          ctx.strokeStyle = inDeadzone ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 2 * dpr;
          ctx.setLineDash([4 * dpr, 4 * dpr]);
          ctx.beginPath();
          ctx.arc(faceScreenX * dpr, faceScreenY * dpr, deadzoneRadius * dpr, 0, Math.PI * 2);
          ctx.stroke();

          if (!inDeadzone) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2 * dpr;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(faceScreenX * dpr, faceScreenY * dpr);
            ctx.lineTo(
              (faceScreenX + Math.cos(stateRef.current.currentAngle) * deadzoneRadius * 1.5) * dpr,
              (faceScreenY + Math.sin(stateRef.current.currentAngle) * deadzoneRadius * 1.5) * dpr
            );
            ctx.stroke();
          }
          ctx.restore();
        }

        stateRef.current.lastDrawnFrame = frameIndex;
        stateRef.current.lastDrawnEyeContact = inDeadzone;
      }

      // Throttled Telemetry Update (Every 250ms = 4 FPS update rate)
      // Eliminates 92% of React state reconciliation cycles
      if (onTelemetryUpdate && now - stateRef.current.telemetryTimer >= 250) {
        stateRef.current.telemetryTimer = now;
        const deg = radToDeg(stateRef.current.currentAngle);
        const compass = inDeadzone
          ? { code: 'CENTER', name: 'Direct Eye Contact' }
          : getCompassDirection(deg);

        onTelemetryUpdate({
          fps: stateRef.current.fps,
          angleDeg: Math.round(deg),
          angleRad: Number(stateRef.current.currentAngle.toFixed(3)),
          frameIndex: inDeadzone ? 225 : frameIndex,
          isEyeContact: inDeadzone,
          compass,
          isLoaded: true,
          loadProgress: 100,
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, isPaused, showDeadzoneVisualizer, activeCompassTarget, onTelemetryUpdate]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen z-0 overflow-hidden select-none"
      style={{
        backgroundColor: '#774C2E',
      }}
    >
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#774C2E] text-center p-6">
          <div className="w-16 h-16 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
            <div className="w-12 h-12 rounded-full border-2 border-t-white border-r-transparent border-b-white/40 border-l-transparent animate-spin" />
            <span className="text-xs font-mono-code text-white">64f</span>
          </div>
          <p className="text-xs font-mono-code uppercase tracking-[0.25em] text-white/90 mb-2">
            Pre-Decoding Character Frames
          </p>
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-mono-code text-white/60">{loadProgress}%</span>
        </div>
      )}

      {/* The Full Screen Canvas: 100vw, 100vh, Object-Fit Cover, NO 3D TRANSFORMS */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          backgroundColor: '#774C2E',
          display: 'block',
        }}
      />
    </div>
  );
};
