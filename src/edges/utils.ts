// Narzedzia do budowania sciezek z waypointami

export interface Waypoint {
  x: number;
  y: number;
}

// Buduje sciezke ortogonalna (lamane pod katem prostym) przez waypoints
export function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): string {
  const points = [
    { x: sourceX, y: sourceY },
    ...waypoints,
    { x: targetX, y: targetY },
  ];

  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Rysuj ortogonalnie: najpierw poziomo, potem pionowo
    const midY = (prev.y + curr.y) / 2;
    path += ` L ${prev.x} ${midY}`;
    path += ` L ${curr.x} ${midY}`;
    path += ` L ${curr.x} ${curr.y}`;
  }

  return path;
}

// Oblicz punkt srodkowy sciezki (do etykiety)
export function getMidpoint(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): { x: number; y: number } {
  const points = [
    { x: sourceX, y: sourceY },
    ...waypoints,
    { x: targetX, y: targetY },
  ];

  // Srodek segmentu srodkowego
  const midIdx = Math.floor(points.length / 2);
  const a = points[midIdx - 1] ?? points[0];
  const b = points[midIdx] ?? points[points.length - 1];

  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
