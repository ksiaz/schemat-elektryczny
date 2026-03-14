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
    e.stopPropagation();
    e.preventDefault();
    dragging.current = true;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const raw = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      const snapped = {
        x: Math.round(raw.x / GRID) * GRID,
        y: Math.round(raw.y / GRID) * GRID,
      };

      const updated = [...waypoints];
      updated[waypointIndex] = snapped;
      useProjectStore.getState().updateEdgeData(edgeId, { waypoints: updated });
    };

    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [edgeId, waypointIndex, waypoints, screenToFlowPosition]);

  return (
    <circle
      cx={x}
      cy={y}
      r={5}
      fill="white"
      stroke="#3b82f6"
      strokeWidth="2"
      style={{ cursor: 'grab' }}
      onMouseDown={onMouseDown}
    />
  );
}
