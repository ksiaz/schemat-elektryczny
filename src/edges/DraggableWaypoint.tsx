import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useProjectStore } from '../store/projectStore.ts';
import type { Waypoint } from './utils.ts';

const GRID = 10;

interface DraggableWaypointProps {
  edgeId: string;
  waypointIndex: number;
  waypoints: Waypoint[];
  x: number;
  y: number;
}

export function DraggableWaypoint({ edgeId, waypointIndex, waypoints, x, y }: DraggableWaypointProps) {
  const { screenToFlowPosition } = useReactFlow();
  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Zatrzymaj WSZYSTKO — nie propaguj do React Flow, node'ow ani canvasu
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    dragging.current = true;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      ev.stopPropagation();
      ev.preventDefault();
      const raw = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      const snapped = {
        x: Math.round(raw.x / GRID) * GRID,
        y: Math.round(raw.y / GRID) * GRID,
      };

      const updated = [...waypoints];
      updated[waypointIndex] = snapped;
      useProjectStore.getState().updateEdgeData(edgeId, { waypoints: updated });
    };

    const onMouseUp = (ev: MouseEvent) => {
      ev.stopPropagation();
      dragging.current = false;
      window.removeEventListener('mousemove', onMouseMove, true);
      window.removeEventListener('mouseup', onMouseUp, true);
    };

    // Capture phase — przechwytuje PRZED innymi listenerami
    window.addEventListener('mousemove', onMouseMove, true);
    window.addEventListener('mouseup', onMouseUp, true);
  }, [edgeId, waypointIndex, waypoints, screenToFlowPosition]);

  return (
    <foreignObject x={x - 8} y={y - 8} width={16} height={16} style={{ overflow: 'visible' }}>
      <div
        onMouseDown={onMouseDown}
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          border: '2px solid white',
          cursor: 'grab',
          pointerEvents: 'all',
          zIndex: 9999,
          position: 'relative',
        }}
      />
    </foreignObject>
  );
}
