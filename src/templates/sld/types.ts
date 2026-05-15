import type { Node, Edge } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

export interface SldTemplate {
  id: string;
  name: string;
  description: string;
  generate(): { nodes: Node<SchematicNodeData>[]; edges: Edge[] };
}
