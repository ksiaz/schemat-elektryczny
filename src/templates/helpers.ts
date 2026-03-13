import type { Node, Edge } from '@xyflow/react';
import type { SchematicNodeData } from '../types/index.ts';

let idCounter = 0;

// Generuje unikalny ID wezla
export function nodeId(prefix: string): string {
  return `${prefix}-tpl-${++idCounter}`;
}

// Tworzy wezel szablonu
export function makeNode(
  id: string,
  type: string,
  x: number,
  y: number,
  data: SchematicNodeData,
  extra?: Partial<Node<SchematicNodeData>>,
): Node<SchematicNodeData> {
  return {
    id,
    type,
    position: { x, y },
    data,
    ...extra,
  };
}

// Tworzy edge szablonu
export function makeEdge(
  source: string,
  target: string,
  type: string = 'multilineAc',
  sourceHandle?: string,
  targetHandle?: string,
  data?: Record<string, unknown>,
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    type,
    sourceHandle: sourceHandle ?? 'out',
    targetHandle: targetHandle ?? 'in',
    data,
  };
}

// Reset countera (wywolaj przed generowaniem szablonu)
export function resetCounter() {
  idCounter = 0;
}
