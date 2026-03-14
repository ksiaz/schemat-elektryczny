import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type TextLabelNodeType = Node<SchematicNodeData, 'textLabel'>;

// Etykieta tekstowa — do opisywania przewodow, elementow, notatek
export function TextLabelNode({ data, selected }: NodeProps<TextLabelNodeType>) {
  const fontSize = String(data.parameters.fontSize || '11');
  const color = String(data.parameters.color || '#333');

  return (
    <div
      className={`${selected ? 'ring-1 ring-blue-400' : ''}`}
      style={{
        fontSize: `${fontSize}px`,
        color,
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
        padding: '1px 3px',
        cursor: 'move',
      }}
    >
      {data.label || 'Opis'}
    </div>
  );
}
