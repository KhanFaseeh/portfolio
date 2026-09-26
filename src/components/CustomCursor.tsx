import React, { useEffect, useRef } from 'react';

interface CustomCursorProps {
  isEyeContact?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isEyeContact = false }) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  // Position & physics state in mutable refs (ZERO React re-renders on mousemove)
  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(false);
  const isEyeContactRef = useRef(isEyeContact);

  useEffect(() => {
    isEyeContactRef.current = isEyeContact;
  }, [isEyeContact]);

  useEffect(() => {
    let animId: number;

    // Disable on touch devices and small viewports
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse), (max-width: 767px)').matches) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    // Use pointerover / pointerout instead of mousemove checking to eliminate layout thrashing
    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.tagName === 'INPUT' ||
          target.classList.contains('clickable')
        );
        isHoveredRef.current = isInteractive;
      }
    };

    const handlePointerOut = () => {
      isHoveredRef.current = false;
    };

    const handleWindowLeave = () => {
      isVisibleRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleEyeContact = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      isEyeContactRef.current = customEvent.detail;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    window.addEventListener('hero-eye-contact', handleEyeContact);
    document.addEventListener('mouseleave', handleWindowLeave);

    // Strict 60fps Hardware-Accelerated RAF Loop (100% translate3d, 0% top/left)
    const renderLoop = () => {
      const tx = targetPos.current.x;
      const ty = targetPos.current.y;

      // Smooth lag-free lerp for the trailing ring
      ringPos.current.x += (tx - ringPos.current.x) * 0.22;
      ringPos.current.y += (ty - ringPos.current.y) * 0.22;

      // Hardware-accelerated translate3d on the central dot (offset by half width: 4px)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx - 4}px, ${ty - 4}px, 0)`;
      }

      // Hardware-accelerated translate3d on the aura ring (offset by half width: 18px)
      if (ringRef.current) {
        const isHover = isHoveredRef.current;
        const isEye = isEyeContactRef.current;
        const scale = isEye ? 1.6 : isHover ? 1.35 : 1.0;

        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px, 0) scale(${scale})`;

        if (isEye) {
          ringRef.current.style.borderColor = 'rgba(255, 255, 255, 0.95)';
          ringRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
          ringRef.current.style.boxShadow = '0 0 20px 2px rgba(255, 255, 255, 0.5)';
        } else if (isHover) {
          ringRef.current.style.borderColor = 'rgba(255, 255, 255, 0.85)';
          ringRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          ringRef.current.style.boxShadow = '0 0 16px rgba(255, 255, 255, 0.35)';
        } else {
          ringRef.current.style.borderColor = 'rgba(255, 255, 255, 0.45)';
          ringRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          ringRef.current.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.15)';
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      window.removeEventListener('hero-eye-contact', handleEyeContact);
      document.removeEventListener('mouseleave', handleWindowLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="hidden md:block pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        zIndex: 999999, // Absolute maximum z-index so cursor is always on top of all modals
      }}
    >
      {/* Central Sharp Glowing White Cursor Dot (translate3d only) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,1)] opacity-0 pointer-events-none will-change-transform"
      />

      {/* Trailing Aura Ring with Hardware-Accelerated transform & will-change */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-white/45 bg-white/5 opacity-0 pointer-events-none will-change-transform"
      />
    </div>
  );
};
