import type { Node, Edge } from '@xyflow/react';

export type SheetFormat = 'A4' | 'A3' | 'A2';
export type WireType = 'L1' | 'L2' | 'L3' | 'N' | 'PE' | 'DC';
export type ElementCategory = 'dc' | 'ac' | 'inverter' | 'ev' | 'transfer' | 'grounding' | 'enclosure' | 'wiring';

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
