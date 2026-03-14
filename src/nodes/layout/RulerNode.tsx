import { NodeResizer, type NodeProps, type Node } from '@xyflow/react';
import type { SchematicNodeData } from '../../types/index.ts';

type RulerNodeType = Node<SchematicNodeData, 'ruler'>;


// Miara — pokazuje odleglosc w metrach, resizable
export function RulerNode({ data, selected }: NodeProps<RulerNodeType>) {
  const orientation = String(data.parameters.orientation || 'pozioma');
  const isHorizontal = orientation === 'pozioma';

  return (
    <div
      className={`${selected ? 'ring-1 ring-blue-400' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        minWidth: isHorizontal ? 50 : 20,
        minHeight: isHorizontal ? 20 : 50,
        position: 'relative',
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={isHorizontal ? 50 : 20}
        minHeight={isHorizontal ? 20 : 50}
        lineStyle={{ stroke: '#3b82f6', strokeWidth: 1 }}
        handleStyle={{ width: 6, height: 6, borderRadius: 2, backgroundColor: '#3b82f6', pointerEvents: 'all' }}
      />

      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        {isHorizontal ? (
          <g>
            {/* Linia glowna */}
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#333" strokeWidth="1" />
            {/* Znaczniki koncowe */}
            <line x1="0" y1="30%" x2="0" y2="70%" stroke="#333" strokeWidth="1.5" />
            <line x1="100%" y1="30%" x2="100%" y2="70%" stroke="#333" strokeWidth="1.5" />
            {/* Strzalki */}
            <polygon points="0,50% 6,46% 6,54%" fill="#333" />
            <text x="50%" y="40%" textAnchor="middle" fontSize="9" fill="#333" fontFamily="monospace">
              {data.label || '?m'}
            </text>
          </g>
        ) : (
          <g>
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#333" strokeWidth="1" />
            <line x1="30%" y1="0" x2="70%" y2="0" stroke="#333" strokeWidth="1.5" />
            <line x1="30%" y1="100%" x2="70%" y2="100%" stroke="#333" strokeWidth="1.5" />
            <text x="70%" y="50%" textAnchor="start" fontSize="9" fill="#333" fontFamily="monospace" dominantBaseline="central">
              {data.label || '?m'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
