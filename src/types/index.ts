import type { Node, Edge } from '@xyflow/react';

export type SheetFormat = 'A4' | 'A3' | 'A2';
export type WireType = 'L1' | 'L2' | 'L3' | 'N' | 'PE' | 'DC';
export type ElementCategory =
  | 'dc' | 'ac' | 'inverter' | 'ev' | 'transfer'
  | 'grounding' | 'enclosure' | 'wiring'
  | 'sldAcSource' | 'sldAcProtection' | 'sldDc'
  | 'sldInverter' | 'sldGrounding' | 'sldEnclosure';

export interface ElementDefinition {
  id: string;
  name: string;
  category: ElementCategory;
  designation: string;
  nodeType: string;
  defaultLabel: string;
  parameters: ParameterDefinition[];
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  unit?: string;
  options?: string[];
  defaultValue?: string | number;
}

export interface SchematicNodeData {
  label: string;
  elementId: string;
  designation: string;
  parameters: Record<string, string | number>;
  rotation?: number;
  [key: string]: unknown;
}

export interface ProjectInfo {
  projectName: string;
  address: string;
  drawingNumber: string;
  revision: string;
  designer: string;
  date: string;
  scale: string;
  format: SheetFormat;
  companyLogo?: string;
}

export interface HistoryEntry {
  nodes: Node<SchematicNodeData>[];
  edges: Edge[];
}

export interface StorageAdapter {
  save(projectId: string, data: string): Promise<void>;
  load(projectId: string): Promise<string | null>;
  list(): Promise<string[]>;
  delete(projectId: string): Promise<void>;
}

export interface SingleLineCableData {
  cableType: string;        // 'YDY' | 'YKY' | 'YKXS' | 'NYM' | 'H1Z2Z2-K' | 'LgY' | string
  cores: number;            // 1..7
  crossSection: number;     // mm²
  peCrossSection?: number;  // mm² (gdy PE chudszy)
  circuitId?: string;       // 'W1', 'O.1'
  length?: number;          // m
  current?: 'AC' | 'DC';
  waypoints?: Array<{ x: number; y: number }>;
}
