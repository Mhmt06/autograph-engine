import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FSMCanvas } from './components/FSMCanvas';
import { Controls } from './components/Controls';
import { FSMData } from './types';
import { generateFSM } from './services/fsmService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = React.useState<FSMData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSearch = async (query: string) => {
    setLoading(true);
    if (window.innerWidth < 1024) setSidebarOpen(false);
    try {
      const fsm = await generateFSM(query);
      setData(fsm);
    } catch (error) {
      console.error("Failed to generate FSM:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!hasInitialized) {
      handleSearch("Gerade Anzahl an '0'en");
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden relative transition-colors duration-300 ${theme}`}>
      <div className="flex h-full w-full bg-[var(--bg-main)] text-[var(--text-primary)] relative">
        {/* Background Blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          isSidebarOpen={isSidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        <main className="flex flex-1 relative overflow-hidden z-10 pt-[72px]">
          <Sidebar 
            data={data} 
            isOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[var(--bg-main)]/60 backdrop-blur-md"
                >
                  <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_var(--accent-glow)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse text-purple-400">Computing Automata</span>
                </motion.div>
              ) : (
                <FSMCanvas data={data} zoom={zoom} />
              )}
            </AnimatePresence>

            <Controls 
              onSearch={handleSearch} 
              onZoomIn={() => setZoom(z => Math.min(z + 0.1, 2))}
              onZoomOut={() => setZoom(z => Math.max(z - 0.1, 0.5))}
              loading={loading}
            />
          </div>
        </main>

        {/* Decorative Overlays */}
        <div className="fixed bottom-6 right-8 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-10 pointer-events-none select-none hidden md:block">
          Finite State Machine Construction Engine // MEHMET DESIGN
        </div>
      </div>
    </div>
  );
}
