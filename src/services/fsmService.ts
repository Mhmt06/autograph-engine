import { GoogleGenAI, Type } from "@google/genai";
import { FSMData, StateType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const FSM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: [StateType.STANDARD, StateType.ACCEPTING, StateType.DEAD] 
          },
          isInitial: { type: Type.BOOLEAN },
        },
        required: ["id", "label", "type", "isInitial"],
      },
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          symbols: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["from", "to", "symbols"],
      },
    },
    alphabet: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["nodes", "edges", "alphabet"],
};

export async function generateFSM(query: string): Promise<FSMData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Construct a Finite State Machine (FSM) for this request: "${query}". 
      Follow strict mathematical logic. Use q0, q1, q2... naming convention. q0 is the start.
      Alphabet should be appropriate (e.g., {0, 1} or {a, b}).
      IMPORTANT: If there are multiple transitions between the same two states, bundle them into a single edge with multiple symbols.`,
      config: {
        systemInstruction: "You are a mathematical automaton expert. You convert natural language descriptions of languages into their corresponding Finite State Machines. Output strictly JSON following the provided schema. Bundle transitions between same states.",
        responseMimeType: "application/json",
        responseSchema: FSM_SCHEMA,
      },
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonStr) as FSMData;
    
    // Auto-layout logic (simple circular for now, or just provide initial positions)
    const count = data.nodes.length;
    const radius = 200;
    data.nodes = data.nodes.map((node, i) => ({
      ...node,
      x: 300 + radius * Math.cos((2 * Math.PI * i) / count),
      y: 300 + radius * Math.sin((2 * Math.PI * i) / count),
    }));

    return data;
  } catch (error) {
    console.error("Error generating FSM:", error);
    throw error;
  }
}
