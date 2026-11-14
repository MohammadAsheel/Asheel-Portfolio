import { useCallback, useEffect, useRef, useState } from 'react';

interface TerminalPolaroidProps {
  className?: string;
}

interface TerminalEntry {
  id: string;
  type: 'echo' | 'output';
  text: string;
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    '<span class="text-[#F3D5BE] font-bold">Available commands:</span>',
    '  <span class="text-[#C85A17]">whoami</span>   - profile summary',
    '  <span class="text-[#C85A17]">skills</span>   - sec &amp; dev stack',
    '  <span class="text-[#C85A17]">projects</span> - featured builds',
    '  <span class="text-[#C85A17]">ctf</span>      - capture the flag',
    '  <span class="text-[#C85A17]">clear</span>    - clear terminal',
  ],
  whoami: () => [
    '<span class="text-[#F3D5BE] font-bold">Asheel Mohammad</span>',
    'B.Tech CSE (Cyber Security)',
    'Securing web apps &amp; crafting clean neo-brutalist UIs.',
  ],
  skills: () => [
    '<span class="text-[#C85A17] font-bold">[SEC]</span> Kali Linux, Burp Suite, Nmap, SQLi, OWASP Top 10',
    '<span class="text-[#4E9A51] font-bold">[DEV]</span> React, JavaScript, Python, SQL, Tailwind CSS',
  ],
  projects: () => [
    '1. <span class="text-[#F3D5BE]">Network Sniffer</span> — Packet analyzer with Scapy',
    '2. <span class="text-[#F3D5BE]">NIDS</span>            — Network intrusion detection system',
    '3. <span class="text-[#F3D5BE]">BALLON Engine</span>   — ML transfer valuation system',
    '4. <span class="text-[#F3D5BE]">Secure Coding</span>   — Vulnerability review & OWASP controls',
    '<span class="text-[#9E978E]">→ Check out the Projects page for full details.</span>',
  ],
  ctf: () => [
    '<span class="text-[#4E9A51] font-bold">[+] Decrypting token...</span>',
    'Flag: <span class="bg-[#C85A17]/25 text-[#F3D5BE] px-1 rounded border border-[#C85A17]">flag{asheel_sec_dev_2026}</span>',
    '<span class="text-[#9E978E]">Tip: Try the # decrypt tab above!</span>',
  ],
};

const HEX_POOL = ['0x4F', '0x9A', '0x1C', '0xE7', '0xB2', '0x3D', '0x80', '0xFF', '0x6A', '0x2E', '0x5B', '0xD4'];

interface HexCell {
  x: number;
  y: number;
  hex: string;
  reveal: number;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function TerminalPolaroid({ className = '' }: TerminalPolaroidProps) {
  const [mode, setMode] = useState<'terminal' | 'decrypt'>('terminal');
  const [history, setHistory] = useState<TerminalEntry[]>(() => [
    { id: 'boot-echo', type: 'echo', text: 'whoami' },
    {
      id: 'boot-out-1',
      type: 'output',
      text: '<span class="text-[#F3D5BE] font-bold">Asheel Mohammad</span> — CyberSec &amp; Frontend Dev',
    },
    {
      id: 'boot-out-2',
      type: 'output',
      text: 'Kali Linux • Burp Suite • Python • SQL • React',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const decryptContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll terminal on new entries
  useEffect(() => {
    if (mode === 'terminal' && terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [history, mode]);

  // Clean up any ongoing typing timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const executeCommand = useCallback(
    (rawCmd: string) => {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd || isTyping) return;

      if (cmd === 'clear') {
        setHistory([]);
        setInputValue('');
        return;
      }

      const echoId = `echo-${Date.now()}`;
      setHistory((prev) => [...prev, { id: echoId, type: 'echo', text: rawCmd.trim() }]);
      setInputValue('');

      const lines = COMMANDS[cmd]
        ? COMMANDS[cmd]()
        : [
            `<span class="text-[#EF4444]">bash: ${escapeHtml(cmd)}: command not found</span>. Type <span class="text-[#C85A17]">help</span>.`,
          ];

      setIsTyping(true);
      let lineIdx = 0;

      const typeNext = () => {
        if (lineIdx >= lines.length) {
          setIsTyping(false);
          return;
        }
        const text = lines[lineIdx];
        const lineId = `out-${Date.now()}-${lineIdx}`;
        setHistory((prev) => [...prev, { id: lineId, type: 'output', text }]);
        lineIdx++;
        typingTimerRef.current = setTimeout(typeNext, 65);
      };

      typingTimerRef.current = setTimeout(typeNext, 65);
    },
    [isTyping],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
    }
  };

  const handleTerminalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      inputRef.current?.focus();
    }
  };

  // Interactive Hex Decrypt Canvas
  useEffect(() => {
    if (mode !== 'decrypt') return;

    const container = decryptContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let cells: HexCell[] = [];
    const pointer = { x: -999, y: -999, active: false };

    const initCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = 8;
      const rows = 11;
      const cellW = rect.width / cols;
      const cellH = rect.height / rows;

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({
            x: c * cellW + cellW / 2,
            y: r * cellH + cellH / 2,
            hex: HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)],
            reveal: 0,
          });
        }
      }
    };

    initCanvas();

    const drawShieldMonogram = (w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2 - 12;

      ctx.save();
      // Outer geometric shield
      ctx.beginPath();
      ctx.moveTo(cx, cy - 58);
      ctx.lineTo(cx + 52, cy - 36);
      ctx.lineTo(cx + 44, cy + 22);
      ctx.lineTo(cx, cy + 56);
      ctx.lineTo(cx - 44, cy + 22);
      ctx.lineTo(cx - 52, cy - 36);
      ctx.closePath();

      ctx.fillStyle = '#1E1E1E';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#C85A17';
      ctx.stroke();

      // Inner shield accent line
      ctx.beginPath();
      ctx.moveTo(cx, cy - 48);
      ctx.lineTo(cx + 42, cy - 29);
      ctx.lineTo(cx + 35, cy + 17);
      ctx.lineTo(cx, cy + 45);
      ctx.lineTo(cx - 35, cy + 17);
      ctx.lineTo(cx - 42, cy - 29);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#F3D5BE';
      ctx.stroke();

      // Bold "AM" monogram
      ctx.fillStyle = '#FFFDF9';
      ctx.font = '800 32px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AM', cx, cy + 2);

      // Hidden CTF flag banner below shield
      ctx.fillStyle = '#C85A17';
      ctx.fillRect(cx - 98, cy + 68, 196, 22);
      ctx.strokeStyle = '#FFFDF9';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 98, cy + 68, 196, 22);

      ctx.fillStyle = '#FFFDF9';
      ctx.font = '700 10.5px "JetBrains Mono", monospace';
      ctx.fillText('flag{asheel_sec_dev_2026}', cx, cy + 79);
      ctx.restore();
    };

    const renderHexLoop = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw decrypted payload layer
      drawShieldMonogram(w, h);

      // 2. Draw encrypted hex matrix tiles
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const radius = 64;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dx = pointer.x - cell.x;
        const dy = pointer.y - cell.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (pointer.active && dist < radius) {
          const target = 1 - dist / radius;
          cell.reveal = Math.max(cell.reveal, target * 1.35);
        } else {
          cell.reveal = Math.max(0, cell.reveal - 0.012);
        }

        if (Math.random() < 0.03) {
          cell.hex = HEX_POOL[Math.floor(Math.random() * HEX_POOL.length)];
        }

        const maskAlpha = Math.max(0, 1 - cell.reveal);
        if (maskAlpha > 0.02) {
          ctx.fillStyle = `rgba(22, 22, 22, ${maskAlpha.toFixed(2)})`;
          ctx.fillRect(cell.x - 24, cell.y - 16, 48, 32);

          ctx.fillStyle =
            cell.reveal > 0.15
              ? `rgba(200, 90, 23, ${maskAlpha.toFixed(2)})`
              : `rgba(130, 124, 115, ${maskAlpha.toFixed(2)})`;
          ctx.fillText(cell.hex, cell.x, cell.y);
        }
      }

      animFrameId = requestAnimationFrame(renderHexLoop);
    };

    renderHexLoop();

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.active = true;
    };

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleMouseLeave = () => {
      pointer.active = false;
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      pointer.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', initCanvas);

    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', initCanvas);
    };
  }, [mode]);

  return (
    <figure
      className={`relative m-0 w-full max-w-72 shrink-0 select-none border-2 border-ink bg-[#FFFDF9] p-4 pb-4.5 shadow-[7px_7px_0_0_var(--ink)] transition-transform duration-250 ease-out hover:rotate-[0.5deg] hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_var(--ink)] sm:max-w-96 md:max-w-72 max-md:self-center rotate-2 ${className}`}
    >
      {/* Burnt-orange Masking Tape at Top */}
      <span
        className="pointer-events-none absolute -top-3 left-1/2 z-20 h-[22px] w-[82px] -translate-x-1/2 -rotate-[1.5deg] border-2 border-ink bg-[#C85A17] shadow-[2px_2px_0_rgba(30,30,30,0.25)]"
        aria-hidden="true"
      />

      {/* Polaroid Interactive Screen */}
      <div className="relative flex aspect-square w-full flex-col overflow-hidden border-2 border-ink bg-[#161616]">
        {/* Top Window Titlebar & Mode Switcher */}
        <div className="z-10 flex items-center justify-between border-b border-[#333] bg-[#232323] px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-full bg-[#C85A17]" />
            <span className="inline-block size-2.5 rounded-full bg-[#E5A93C]" />
            <span className="inline-block size-2.5 rounded-full bg-[#4E9A51]" />
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setMode('terminal')}
              className={`cursor-pointer rounded px-1.5 py-0.5 font-bold transition-colors ${
                mode === 'terminal' ? 'bg-[#C85A17] text-[#FFFDF9]' : 'bg-[#161616] text-[#A8A29E] hover:text-white'
              }`}
            >
              &gt;_ term
            </button>
            <button
              type="button"
              onClick={() => setMode('decrypt')}
              className={`cursor-pointer rounded px-1.5 py-0.5 font-bold transition-colors ${
                mode === 'decrypt' ? 'bg-[#C85A17] text-[#FFFDF9]' : 'bg-[#161616] text-[#A8A29E] hover:text-white'
              }`}
            >
              # decrypt
            </button>
          </div>
        </div>

        {/* VIEW 1: Interactive Kali Terminal */}
        <div
          ref={terminalScrollRef}
          onClick={handleTerminalClick}
          className={`terminal-scroll relative flex-1 cursor-text overflow-y-auto p-3 font-mono text-[11.5px] leading-relaxed text-[#F5EFE6] select-text ${
            mode === 'terminal' ? 'flex flex-col' : 'hidden'
          }`}
        >
          <div className="space-y-1.5">
            {history.map((entry) => (
              <div key={entry.id}>
                {entry.type === 'echo' ? (
                  <div>
                    <span className="text-[#C85A17]">└─$</span>{' '}
                    <span className="font-semibold text-[#FFFDF9]">{entry.text}</span>
                  </div>
                ) : (
                  <div className="pl-1 text-[#D6CFC5]" dangerouslySetInnerHTML={{ __html: entry.text }} />
                )}
              </div>
            ))}
          </div>

          {/* Active Input Prompt Line */}
          <div className="mt-2 flex flex-wrap items-center">
            <span className="mr-1.5 font-bold text-[#C85A17]">┌──(asheel㉿kali)-[~]</span>
            <div className="flex w-full items-center">
              <span className="mr-1.5 font-bold text-[#C85A17]">└─$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Kali terminal command input"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[11.5px] text-[#FFFDF9] caret-[#C85A17] outline-none"
                placeholder="type 'help'..."
              />
            </div>
          </div>

          {/* Quick Command Chips */}
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#2A2A2A] pt-2 select-none">
            {(['whoami', 'skills', 'ctf', 'clear'] as const).map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  executeCommand(cmd);
                }}
                className="cursor-pointer rounded border border-[#383838] bg-[#242424] px-2 py-1 text-[10.5px] font-medium text-[#D6CFC5] transition-colors hover:border-[#C85A17] hover:bg-[#C85A17] hover:text-white active:scale-95"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* VIEW 2: Interactive Hex-Decrypt Canvas */}
        <div
          ref={decryptContainerRef}
          className={`relative h-full w-full flex-1 cursor-crosshair overflow-hidden bg-[#161616] ${
            mode === 'decrypt' ? 'block' : 'hidden'
          }`}
        >
          <canvas ref={canvasRef} className="block h-full w-full" />
          <div className="pointer-events-none absolute right-0 bottom-2 left-0 text-center">
            <span className="rounded border border-[#C85A17]/60 bg-[#161616]/90 px-2 py-0.5 font-mono text-[9.5px] text-[#F3D5BE]">
              hover / drag to decrypt payload
            </span>
          </div>
        </div>

        {/* Subtle CRT Scanlines */}
        <div className="terminal-scanlines pointer-events-none absolute inset-0 z-10" />
      </div>

      {/* Bottom Polaroid Margin Caption */}
      <figcaption className="mt-3.5 flex items-center justify-between pt-0.5 font-mono">
        <span className="text-[13px] font-extrabold tracking-tight text-ink">root@asheel:~#</span>
        <span className="inline-flex items-center gap-1.5 rounded border border-ink bg-[#FAF4EB] px-2 py-0.5 text-[10px] font-bold text-ink">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#16A34A]" />
          </span>
          ONLINE
        </span>
      </figcaption>
    </figure>
  );
}
