import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type LegendNodeType = Node<SchematicNodeData, 'legend'>;

// Legenda z objasnieniem symboli
export function LegendNode({ data, selected }: NodeProps<LegendNodeType>) {
  return (
    <div className={`${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ cursor: 'move' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          fontSize: '9px',
          fontFamily: 'monospace',
          backgroundColor: 'white',
          border: '1px solid #999',
          minWidth: 180,
        }}
      >
        <thead>
          <tr>
            <td colSpan={2} style={{ border: '1px solid #bbb', padding: '3px 6px', fontWeight: 'bold', fontSize: '10px', textAlign: 'center' }}>
              {data.label || 'LEGENDA'}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#FF0000' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Trasa DC+</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#0000CD' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Trasa DC-</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, background: 'repeating-linear-gradient(90deg, #228B22 0px, #228B22 4px, #FFD700 4px, #FFD700 8px)' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Przewód uziemienia PE</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#808080' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Faza L1</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#1a1a1a' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Faza L2</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#8B4513' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Faza L3</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#0000CD' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Neutralny N</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>
              <div style={{ width: 30, height: 3, backgroundColor: '#FF6600' }} />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '2px 6px' }}>Trasa kablowa</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
