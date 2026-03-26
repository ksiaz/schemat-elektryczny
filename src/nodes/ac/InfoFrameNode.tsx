import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type InfoFrameNodeType = Node<SchematicNodeData, 'infoFrame'>;

// Ramka informacyjna — dynamiczne rubryki, resizable
export function InfoFrameNode({ data, selected }: NodeProps<InfoFrameNodeType>) {
  // Rubryki zapisane jako JSON string w parameters.rows
  let rows: Array<{ label: string; value: string }> = [];
  try {
    rows = JSON.parse(String(data.parameters.rows || '[]'));
  } catch {
    rows = [
      { label: 'Projekt', value: '' },
      { label: 'Adres', value: '' },
      { label: 'Projektant', value: '' },
      { label: 'Data', value: '' },
      { label: 'Format', value: 'A4' },
    ];
  }

  if (rows.length === 0) {
    rows = [
      { label: 'Projekt', value: '' },
      { label: 'Adres', value: '' },
      { label: 'Projektant', value: '' },
      { label: 'Data', value: '' },
      { label: 'Format', value: 'A4' },
    ];
  }

  const fontSize = Number(data.parameters.fontSize) || 9;

  return (
    <div className={`w-full h-full ${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ minWidth: 150, minHeight: 40, cursor: 'move' }}>
      <NodeResizer isVisible={selected} minWidth={150} minHeight={40}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }} />

      <table style={{
        borderCollapse: 'collapse',
        fontSize: `${fontSize}px`,
        fontFamily: 'monospace',
        backgroundColor: 'white',
        border: '1px solid #999',
        width: '100%',
        height: '100%',
      }}>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999', whiteSpace: 'nowrap', width: '30%' }}>
                {row.label}:
              </td>
              <td style={{ border: '1px solid #bbb', padding: '2px 5px', fontWeight: row.label === 'Projekt' ? 'bold' : 'normal' }}>
                {row.value || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
