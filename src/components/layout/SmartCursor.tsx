import { useEffect, useRef } from 'react';

export default function SmartCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const hasFinePointer: boolean = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!cursor || !hasFinePointer) return;

    const handleMouseMove = (event: MouseEvent): void => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      cursor.dataset.visible = 'true';
    };

    const handleMouseLeave = (): void => {
      cursor.dataset.visible = 'false';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={cursorRef} className="smart-cursor" aria-hidden="true" />;
}
