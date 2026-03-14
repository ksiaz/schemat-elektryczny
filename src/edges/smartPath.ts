// Wrapper na getSmartEdge — zwraca sciezke omijajaca wezly
import { getSmartEdge } from '@jalez/react-flow-smart-edge';
import { type Node, Position } from '@xyflow/react';
import { buildOrthogonalPath } from './utils.ts';

interface SmartPathOptions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  nodes: Node[];
}

function toPosition(s: string): Position {
  if (s === 'top') return Position.Top;
  if (s === 'bottom') return Position.Bottom;
  if (s === 'left') return Position.Left;
  if (s === 'right') return Position.Right;
  return Position.Bottom;
}

// Probuj smart pathfinding, fallback na ortogonalna sciezke
export function getSmartPath(opts: SmartPathOptions): { path: string; labelX: number; labelY: number } {
  try {
    const result = getSmartEdge({
      sourceX: opts.sourceX,
      sourceY: opts.sourceY,
      targetX: opts.targetX,
      targetY: opts.targetY,
      sourcePosition: toPosition(opts.sourcePosition),
      targetPosition: toPosition(opts.targetPosition),
      nodes: opts.nodes,
      options: {
        nodePadding: 15,
        gridRatio: 8,
      },
    });

    if (result) {
      return {
        path: result.svgPathString,
        labelX: (opts.sourceX + opts.targetX) / 2,
        labelY: (opts.sourceY + opts.targetY) / 2,
      };
    }
  } catch {
    // Fallback
  }

  // Fallback — ortogonalna sciezka
  const path = buildOrthogonalPath(opts.sourceX, opts.sourceY, opts.targetX, opts.targetY);
  return {
    path,
    labelX: (opts.sourceX + opts.targetX) / 2,
    labelY: Math.min(opts.sourceY, opts.targetY) + Math.abs(opts.targetY - opts.sourceY) / 2,
  };
}
