/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

type LogEntry = {
  id: string;
  type: 'user' | 'system' | 'nos-sync';
  content: string;
};

export default function App() {
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [latentState, setLatentState] = useState('Aguardando divergência de input...');
  const [jitCompiled, setJitCompiled] = useState(false);
  
  const endOfLogsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aurora_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    } else {
      setHistory([
        { id: crypto.randomUUID(), type: 'system', content: '[INICIALIZAÇÃO NÓS]' },
        { id: crypto.randomUUID(), type: 'system', content: 'Núcleo de Orquestração Semântica online. Sincronização de estado ativa.' }
      ]);
    }
  }, []);

  // Save to localStorage and auto-scroll when history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('aurora_history', JSON.stringify(history));
    }
    setTimeout(() => {
      endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }, [history]);

  // Keep input focused
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Real-time latent space prediction (NÓS Architecture)
  useEffect(() => {
    const val = inputValue.toLowerCase().trim();
    if (!val) {
      setLatentState('Aguardando divergência de input...');
      setJitCompiled(false);
      return;
    }

    if ('iniciar'.startsWith(val)) {
      setLatentState('PREVISÃO: Instanciação de Enxame [99.8%]');
      setJitCompiled(val === 'iniciar');
    } else if ('clear'.startsWith(val)) {
      setLatentState('PREVISÃO: Purga de Memória [98.5%]');
      setJitCompiled(val === 'clear');
    } else if ('eu quero'.startsWith(val) || 'eu q'.startsWith(val)) {
      setLatentState('Mapeando intenção do operador para árvore sintática...');
      setJitCompiled(false);
    } else {
      setLatentState(`Calculando trajetória vetorial para: [${val}]...`);
      setJitCompiled(false);
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const cmd = inputValue.trim();
      const newEntry: LogEntry = { id: crypto.randomUUID(), type: 'user', content: cmd };

      if (cmd.toLowerCase() === 'clear') {
        setHistory([]);
        setInputValue('');
        localStorage.removeItem('aurora_history');
        return;
      }

      let systemResponse: LogEntry;
      if (cmd.toLowerCase() === 'iniciar') {
        systemResponse = { 
          id: crypto.randomUUID(), 
          type: 'nos-sync', 
          content: '[NÓS] Estado JIT compilado. Fronteira colapsada. O ambiente agora respira com você.' 
        };
      } else {
        systemResponse = { 
          id: crypto.randomUUID(), 
          type: 'system', 
          content: `[NÓS] AST Executado. Vetor '${cmd}' integrado à matriz de estado.` 
        };
      }

      setHistory((prev) => [...prev, newEntry, systemResponse]);
      setInputValue('');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-[#0f0] font-mono p-4 flex flex-col selection:bg-[#0f0] selection:text-black relative">
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 scanlines opacity-60"></div>
      
      {/* Top Status Bar - NÓS Architecture */}
      <div className="shrink-0 border-b border-[#0f0]/30 pb-2 mb-4 flex justify-between text-xs z-10 relative text-[#0f0]/70">
        <div>NÚCLEO: OPERACIONAL</div>
        <div className="animate-pulse">STREAMING DE ESTADO: ATIVO</div>
        <div>LATÊNCIA: 12ms</div>
      </div>

      <div className="flex-1 overflow-y-auto break-words whitespace-pre-wrap flex flex-col z-10 relative">
        <div className="mt-auto space-y-1">
          {history.map((entry) => (
            <div 
              key={entry.id} 
              className={
                entry.type === 'nos-sync' ? 'text-[#f0f] font-bold' : 
                entry.type === 'system' ? 'text-[#ff0]' : 
                'text-[#0f0]'
              }
            >
              {entry.type === 'user' ? `> ${entry.content}` : entry.content}
            </div>
          ))}
          <div ref={endOfLogsRef} />
        </div>
      </div>
      
      {/* Predictive Input Area */}
      <div className="mt-4 shrink-0 z-10 relative border-t border-[#0f0]/30 pt-4">
        {/* Latent State Visualizer */}
        <div className="mb-2 text-xs h-4 flex items-center gap-2">
          <span className="text-[#0f0]/50">ESTADO LATENTE:</span>
          <span className={jitCompiled ? 'text-[#ff0] font-bold' : 'text-[#0f0]/80'}>
            {latentState}
          </span>
          {jitCompiled && <span className="bg-[#ff0] text-black px-1 font-bold animate-pulse">JIT PRONTO</span>}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#0f0] font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-[#0f0] caret-[#0f0] placeholder-[#050]"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
