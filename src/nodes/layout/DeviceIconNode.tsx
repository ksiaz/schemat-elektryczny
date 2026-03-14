import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type DeviceIconNodeType = Node<SchematicNodeData, 'deviceIcon'>;

// Ikony urzadzen: falownik, rozdzielnica, uziom, ladowarka
const DEVICE_ICONS: Record<string, { svg: string; color: string }> = {
  inverter: {
    svg: '<rect x="5" y="5" width="30" height="30" fill="#333" stroke="black" stroke-width="1.5"/><text x="20" y="22" text-anchor="middle" font-size="8" font-family="monospace">=~</text>',
    color: '#333',
  },
  enclosure: {
    svg: '<rect x="3" y="3" width="34" height="34" fill="#f3f4f6" stroke="#666" stroke-width="1.5" rx="2"/><line x1="3" y1="12" x2="37" y2="12" stroke="#999" stroke-width="0.5"/>',
    color: '#666',
  },
  ground: {
    svg: '<line x1="20" y1="5" x2="20" y2="18" stroke="green" stroke-width="1.5"/><line x1="8" y1="18" x2="32" y2="18" stroke="green" stroke-width="1.5"/><line x1="12" y1="24" x2="28" y2="24" stroke="green" stroke-width="1.5"/><line x1="16" y1="30" x2="24" y2="30" stroke="green" stroke-width="1.5"/>',
    color: '#228B22',
  },
  charger: {
    svg: '<rect x="5" y="5" width="30" height="30" fill="#333" stroke="black" stroke-width="1.5" rx="3"/><text x="20" y="24" text-anchor="middle" font-size="8" font-weight="bold">EV</text>',
    color: '#333',
  },
  battery: {
    svg: '<rect x="4" y="4" width="32" height="32" fill="none" stroke="#333" stroke-width="1.5" rx="2"/><line x1="12" y1="14" x2="12" y2="26" stroke="#333" stroke-width="3"/><line x1="18" y1="17" x2="18" y2="23" stroke="#333" stroke-width="1.5"/><line x1="24" y1="14" x2="24" y2="26" stroke="#333" stroke-width="3"/><line x1="30" y1="17" x2="30" y2="23" stroke="#333" stroke-width="1.5"/>',
    color: '#333',
  },
  fire: {
    svg: '<circle cx="20" cy="20" r="15" fill="none" stroke="#FF0000" stroke-width="2"/><line x1="10" y1="10" x2="30" y2="30" stroke="#FF0000" stroke-width="2"/><line x1="30" y1="10" x2="10" y2="30" stroke="#FF0000" stroke-width="2"/>',
    color: '#FF0000',
  },
};

export function DeviceIconNode({ data, selected }: NodeProps<DeviceIconNodeType>) {
  const deviceType = String(data.parameters.deviceType || 'enclosure');
  const icon = DEVICE_ICONS[deviceType] ?? DEVICE_ICONS.enclosure;

  return (
    <div className={`flex flex-col items-center ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="source" position={Position.Top} id="in" className="!bg-gray-500 !w-1.5 !h-1.5" />

      <svg width="40" height="40" viewBox="0 0 40 40" dangerouslySetInnerHTML={{ __html: icon.svg }} />

      <div className="text-xs font-bold mt-1" style={{ color: icon.color }}>{data.label}</div>

      <Handle type="source" position={Position.Bottom} id="out" className="!bg-gray-500 !w-1.5 !h-1.5" />
    </div>
  );
}
