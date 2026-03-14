import { type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';
import { useProjectStore } from '../../store/projectStore.ts';

type InfoFrameNodeType = Node<SchematicNodeData, 'infoFrame'>;

// Ramka informacyjna — przesuwalna, edytowalna w Properties
export function InfoFrameNode({ selected }: NodeProps<InfoFrameNodeType>) {
  const { projectInfo, schematicFormat } = useProjectStore();

  return (
    <div className={`${selected ? 'ring-1 ring-blue-400' : ''}`} style={{ cursor: 'move' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          fontSize: '9px',
          fontFamily: 'monospace',
          backgroundColor: 'white',
          border: '1px solid #999',
          minWidth: 220,
        }}
      >
        <tbody>
          <tr>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999', width: 50 }}>Projekt:</td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', fontWeight: 'bold' }} colSpan={3}>
              {projectInfo.projectName || '—'}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999' }}>Adres:</td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px' }} colSpan={2}>
              {projectInfo.address || '—'}
            </td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999', width: 70 }}>
              Data: <span style={{ color: '#333' }}>{projectInfo.date}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999' }}>Proj.:</td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px' }} colSpan={2}>
              {projectInfo.designer || '—'}
            </td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999' }}>
              Skala: <span style={{ color: '#333' }}>{projectInfo.scale}</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', color: '#999' }}>Format:</td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px', fontWeight: 'bold' }}>
              {schematicFormat}
            </td>
            <td style={{ border: '1px solid #bbb', padding: '2px 5px' }} colSpan={2}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
