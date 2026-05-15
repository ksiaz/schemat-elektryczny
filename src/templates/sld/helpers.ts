import type { Node, Edge } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

let counter = 0;

export function resetCounter() {
  counter = 0;
}

export function nodeId(prefix: string): string {
  counter += 1;
  return `sld-${prefix}-${counter}`;
}

export function makeNode(
  id: string,
  type: string,
  x: number,
  y: number,
  data: SchematicNodeData,
): Node<SchematicNodeData> {
  return { id, type, position: { x, y }, data };
}

export interface SldCableData {
  cableType: string;
  cores: number;
  crossSection: number;
  peCrossSection?: number;
  circuitId?: string;
  length?: number;
  current?: 'AC' | 'DC';
}

export function makeCable(
  source: string,
  target: string,
  data: SldCableData,
  sourceHandle = 'out',
  targetHandle = 'in',
): Edge {
  return {
    id: `e-${source}-${target}-${counter++}`,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'singleLineCable',
    data: data as unknown as Record<string, unknown>,
  };
}
