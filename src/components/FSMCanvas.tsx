import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FSMData, StateType } from '../types';

interface FSMCanvasProps {
  data: FSMData | null;
  zoom: number;
}

export const FSMCanvas = ({ data, zoom }: FSMCanvasProps) => {
  const containerRef = React.useRef<SVGSVGElement>(null);

  if (!data) return null;

  const nodeRadius = 35;

  const getEdgeDetails = (edge: { from: string; to: string }, allEdges: typeof data.edges) => {
    const isSelfLoop = edge.from === edge.to;
    const hasReverse = allEdges.some((e) => e.from === edge.to && e.to === edge.from);
    return { isSelfLoop, hasReverse };
  };

  const renderEdge = (edge: typeof data.edges[0], index: number) => {
    const fromNode = data.nodes.find((n) => n.id === edge.from);
    const toNode = data.nodes.find((n) => n.id === edge.to);

    if (!fromNode || !toNode) return null;

    const { isSelfLoop, hasReverse } = getEdgeDetails(edge, data.edges);

    const x1 = fromNode.x || 0;
    const y1 = fromNode.y || 0;
    const x2 = toNode.x || 0;
    const y2 = toNode.y || 0;

    if (isSelfLoop) {
      const loopRadius = 25;
      const loopX = x1;
      const loopY = y1 - nodeRadius;
      return (
        <g key={`edge-${index}`}>
          <path
            d={`M ${x1} ${y1 - nodeRadius} A ${loopRadius} ${loopRadius} 0 1 1 ${x1 + 0.1} ${y1 - nodeRadius}`}
            fill="none"
            stroke="currentColor"
            className="text-[var(--text-primary)] opacity-40"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />
          <foreignObject
            x={x1 - 25}
            y={y1 - nodeRadius - 40}
            width="50"
            height="24"
            className="overflow-visible"
          >
            <div className="flex justify-center items-center h-full">
              <span className="px-2 py-0.5 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-purple-500 rounded text-[10px] font-black font-mono shadow-lg whitespace-nowrap transition-colors">
                {edge.symbols.join(', ')}
              </span>
            </div>
          </foreignObject>
        </g>
      );
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normal vectors
    const nx = -dy / distance;
    const ny = dx / distance;

    // Control point for curve
    const curveAmount = hasReverse ? 40 : 0;
    const mx = (x1 + x2) / 2 + nx * curveAmount;
    const my = (y1 + y2) / 2 + ny * curveAmount;

    // Calculate angle at end to offset for node radius
    const angle = Math.atan2(y2 - my, x2 - mx);
    const targetX = x2 - Math.cos(angle) * (nodeRadius + 2);
    const targetY = y2 - Math.sin(angle) * (nodeRadius + 2);

    const pathD = `M ${x1} ${y1} Q ${mx} ${my} ${targetX} ${targetY}`;

    return (
      <g key={`edge-${index}`}>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          d={pathD}
          fill="none"
          stroke="currentColor"
          className="text-[var(--text-primary)] opacity-40"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead)"
        />
        <foreignObject
          x={mx - 25}
          y={my - 12}
          width="50"
          height="24"
          className="overflow-visible"
        >
          <div className="flex justify-center items-center h-full">
            <span className="px-2 py-0.5 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 text-purple-500 rounded text-[10px] font-black font-mono shadow-lg whitespace-nowrap transition-colors">
              {edge.symbols.join(', ')}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="w-full h-full overflow-hidden bg-[var(--bg-main)] dot-grid flex items-center justify-center relative cursor-grab active:cursor-grabbing transition-colors duration-300">
      <motion.svg
        ref={containerRef}
        viewBox="0 0 800 800"
        className="w-full h-full max-w-[1200px] max-h-[1200px]"
        animate={{ scale: zoom }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="currentColor" className="text-[var(--text-primary)] opacity-40" />
          </marker>
        </defs>

        <AnimatePresence>
          {data.edges.map(renderEdge)}
          
          {data.nodes.map((node) => {
            const isAccepting = node.type === StateType.ACCEPTING;
            const isDead = node.type === StateType.DEAD;
            const x = node.x || 0;
            const y = node.y || 0;

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              >
                {/* Entry Arrow */}
                {node.isInitial && (
                  <path
                    d={`M ${x - nodeRadius - 40} ${y} L ${x - nodeRadius - 5} ${y}`}
                    stroke="currentColor"
                    className="text-[var(--text-primary)] opacity-40"
                    strokeWidth="1.5"
                    markerEnd="url(#arrowhead)"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={nodeRadius}
                  className={`fill-[var(--bg-surface)] backdrop-blur-xl stroke-1.5 transition-all duration-500 ${
                    isDead ? 'stroke-red-500/30 bg-red-500/5' : 
                    isAccepting ? 'stroke-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 
                    'stroke-[var(--border-color)]'
                  }`}
                  style={isAccepting ? { filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.4))' } : {}}
                />
                
                {/* Accepting Inner Circle */}
                {isAccepting && (
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeRadius - 5}
                    className="fill-none stroke-purple-500/40 stroke-1"
                  />
                )}

                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`font-mono font-black select-none tracking-tighter transition-colors ${isDead ? 'fill-red-500/70' : 'fill-[var(--text-primary)]'}`}
                  fontSize="14"
                >
                  {node.id}
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>
      </motion.svg>
      
      <div className="absolute top-2 md:top-24 left-4 md:left-8 pointer-events-none">
        <div className="flex flex-col gap-1.5">
          <span className="text-[8px] md:text-[10px] font-black uppercase text-[var(--text-secondary)] opacity-20 tracking-[0.2em] transition-opacity">Engine Signal</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-[9px] md:text-[10px] font-mono font-black uppercase text-[var(--text-secondary)] opacity-40">Scale_{zoom.toFixed(2)}v</span>
          </div>
        </div>
      </div>
    </div>
  );
};
