export enum StateType {
  STANDARD = 'standard',
  ACCEPTING = 'accepting',
  DEAD = 'dead',
}

export interface FSMNode {
  id: string; // e.g., "q0", "q1"
  label: string;
  type: StateType;
  isInitial: boolean;
  x?: number;
  y?: number;
}

export interface FSMEdge {
  from: string;
  to: string;
  symbols: string[]; // e.g., ["0", "1"]
}

export interface FSMData {
  nodes: FSMNode[];
  edges: FSMEdge[];
  alphabet: string[];
}
