'use client';

import { useEffect } from 'react';

export default function CursorGlow() {
  useEffect(() => {
    let cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;
    let mouseX = 0;
    let mouseY = 0;

    const updateCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorGlow) {
        cursorGlow.style.transform = `translate(${mouseX - 20}px, ${mouseY - 20}px)`;
      }
    };

    const addGlow = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('group-hover')) return;
      target.style.position = 'relative';
      target.style.zIndex = '20';
      const glow = document.createElement('div');
      glow.className = 'cursor-glow absolute inset-0 bg-gradient-to-r from-accent-gold/30 via-neon-blue/30 to-neon-purple/30 rounded-3xl blur-xl opacity-0 animate-glow-pulse pointer-events-none';
      target.appendChild(glow);
      setTimeout(() => glow.remove(), 800);
    };

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', addGlow);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', addGlow);
    };
  }, []);

  return <div className="fixed top-1/2 left-1/2 w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full blur-xl mix-blend-multiply opacity-30 pointer-events-none z-50 transition-all duration-300 cursor-glow translate-x-[-50%] translate-y-[-50%]" />;
}

