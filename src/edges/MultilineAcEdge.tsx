import { BaseEdge, getSmoothStepPath, type EdgeProps } from '@xyflow/react';
import { WIRE_COLORS } from '../constants/index.ts';

// Odstep miedzy zylami w px (odpowiednik ~1mm w canvas)
const WIRE_SPACING = 3;

// Kolejnosc zyl i ich kolory
const WIRES = [
  { id: 'L1', color: WIRE_COLORS.L1 },
  { id: 'L2', color: WIRE_COLORS.L2 },
  { id: 'L3', color: WIRE_COLORS.L3 },
  { id: 'N', color: WIRE_COLORS.N },
  { id: 'PE', color: WIRE_COLORS.PE },
];

export interface MultilineAcEdgeData {
  cableType?: string;     // np. YDYżo
  cableSection?: string;  // np. 5x2.5
  cableLength?: string;   // np. 15m
  [key: string]: unknown;
}

export function MultilineAcEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as MultilineAcEdgeData | undefined;

  // Srodkowa sciezka (bazowa)
  const [basePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  // Opis przewodu
  const cableLabel = [
    edgeData?.cableType,
    edgeData?.cableSection,
    edgeData?.cableLength,
  ].filter(Boolean).join(' ');

  return (
    <g className={selected ? 'opacity-100' : 'opacity-90'}>
      {/* 5 rownoleglych linii — przesuniecie prostopadle do sciezki */}
      {WIRES.map((wire, i) => {
        const offset = (i - 2) * WIRE_SPACING; // -6, -3, 0, 3, 6
        return (
          <g key={wire.id} transform={`translate(${offset}, 0)`}>
            <BaseEdge
              id={`${id}-${wire.id}`}
              path={basePath}
              style={{
                stroke: wire.color,
                strokeWidth: selected ? 1.5 : 1,
              }}
            />
          </g>
        );
      })}

      {/* Etykieta z opisem przewodu */}
      {cableLabel && (
        <g transform={`translate(${labelX}, ${labelY - 12})`}>
          <rect
            x={-40} y={-8}
            width={80} height={16}
            fill="white" stroke="#ccc" strokeWidth="0.5" rx="2"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="9"
            fill="#555"
            fontFamily="monospace"
          >
            {cableLabel}
          </text>
        </g>
      )}

      {/* Oznaczenia zyl przy zrodle */}
      <g transform={`translate(${sourceX}, ${sourceY + 8})`}>
        {WIRES.map((wire, i) => {
          const offset = (i - 2) * WIRE_SPACING;
          return (
            <text
              key={wire.id}
              x={offset}
              y={10}
              textAnchor="middle"
              fontSize="6"
              fill={wire.color}
              fontWeight="bold"
            >
              {wire.id}
            </text>
          );
        })}
      </g>
    </g>
  );
}
