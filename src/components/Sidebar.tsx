import React from 'react';
import { FSMData, StateType } from '../types';
import { Info, BarChart3, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  data: FSMData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ data, isOpen, onClose }: SidebarProps) => {
  const content = (
    <div className="w-80 h-full bg-[var(--bg-sidebar)] backdrop-blur-2xl border-r border-[var(--border-color)] p-8 flex flex-col gap-10 pt-28 overflow-y-auto no-scrollbar z-[55] transition-colors">
      <section>
        <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          <BarChart3 size={14} className="text-purple-500" />
          System Analytics
        </div>
        <div className="space-y-6">
          <div className="relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1 opacity-60">Total Nodes</span>
              <span className="text-2xl font-mono font-bold leading-none text-[var(--text-primary)]">{data?.nodes.length || 0}</span>
            </div>
          </div>
          <div className="relative pl-4">
            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest mb-1 opacity-60">Transitions</span>
              <span className="text-2xl font-mono font-bold leading-none text-[var(--text-primary)]">{data?.edges.length || 0}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          <Database size={14} className="text-purple-500" />
          Alphabet Σ
        </div>
        <div className="flex flex-wrap gap-2">
          {data?.alphabet.map((s) => (
            <span key={s} className="px-3 py-1.5 bg-white/5 border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] font-mono font-bold rounded-lg leading-none shadow-sm">
              {s}
            </span>
          )) || <span className="text-xs italic text-[var(--text-secondary)] opacity-40">No alphabet detected</span>}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          <Info size={14} className="text-purple-500" />
          Legend
        </div>
        <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          <div className="flex items-center gap-4 group">
            <div className="w-5 h-5 rounded-full border border-[var(--border-color)] bg-white/5 transition-colors group-hover:border-[var(--text-secondary)]" />
            <span>Standard State</span>
          </div>
          <div className="flex items-center gap-4 group text-purple-400">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
              <div className="absolute inset-1 rounded-full border border-purple-500/50" />
            </div>
            <span className="tracking-widest">Accepting State</span>
          </div>
          <div className="flex items-center gap-4 group text-red-500/70">
            <div className="w-5 h-5 rounded-full border border-red-500/30 bg-red-500/5" />
            <span>Dead State</span>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="flex items-center gap-1">
               <div className="w-4 h-[1px] bg-[var(--text-secondary)] opacity-40" />
               <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-[var(--text-secondary)] opacity-40" />
            </div>
            <span>Entry Point</span>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 z-[60] lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
