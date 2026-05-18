import React from 'react';
import { Search, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ControlsProps {
  onSearch: (query: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  loading: boolean;
}

const EXAMPLES = [
  "Gerade Anzahl an '0'en",
  "Akzeptiert nur 'ab'",
  "Endet auf '01'",
];

export const Controls = ({ onSearch, onZoomIn, onZoomOut, loading }: ControlsProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) onSearch(inputValue);
  };

  return (
    <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 md:px-6 flex flex-col gap-4 md:gap-6 z-40 transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:justify-center gap-2 no-scrollbar pb-2 md:pb-0">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setInputValue(ex);
                onSearch(ex);
              }}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-color)] rounded-xl text-[9px] md:text-[10px] uppercase font-black tracking-widest text-[var(--text-secondary)] opacity-60 hover:opacity-100 hover:border-purple-500/50 hover:text-[var(--text-primary)] transition-all whitespace-nowrap shadow-sm"
            >
              {ex}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-purple-500/10 blur-2xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Beschreibe deinen Automaten..."
            className="relative w-full h-14 md:h-18 bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl px-12 md:px-16 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-purple-500/50 transition-all shadow-2xl"
          />
          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-40 group-focus-within:text-purple-400 group-focus-within:opacity-100 transition-all" size={20} />
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center">
             <button
              type="submit"
              disabled={loading}
              className="h-10 md:h-12 px-4 md:px-8 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 md:gap-3"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={14} className="hidden sm:block" />}
              {loading ? '...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={onZoomIn} className="p-3 md:p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl hover:border-purple-500/50 hover:bg-white/10 transition-all backdrop-blur-md shadow-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ZoomIn size={18} />
        </button>
        <button onClick={onZoomOut} className="p-3 md:p-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl hover:border-purple-500/50 hover:bg-white/10 transition-all backdrop-blur-md shadow-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ZoomOut size={18} />
        </button>
      </div>
    </div>
  );
};
