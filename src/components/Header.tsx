import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header = ({ theme, toggleTheme, isSidebarOpen, setSidebarOpen }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--bg-surface)] backdrop-blur-xl border-b border-[var(--border-color)] z-[60] px-4 md:px-6 py-4 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex flex-col">
          <span className="text-lg md:text-xl font-bold tracking-tighter text-[var(--text-primary)] uppercase">AUTOGRAPH.ENGINE</span>
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-[0.2em] -mt-0.5">by MEHMET</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 bg-white/5 border border-[var(--border-color)] rounded-xl hover:border-purple-500/50 transition-all text-[var(--text-primary)]"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono font-bold text-[var(--text-secondary)] opacity-40 tracking-widest">
          <span>v1.0.4-PROD</span>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
        </div>
      </div>
    </header>
  );
};
