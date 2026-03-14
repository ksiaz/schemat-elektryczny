// Narzedzia do budowania sciezek z waypointami

export interface Waypoint {
  x: number;
  y: number;
}

// Margines odskok od wezla — przewod nie przechodzi przez element
const NODE_MARGIN = 40;

// Buduje sciezke ortogonalna (lamane pod katem prostym) przez waypoints
export function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): string {
  // Jesli sa waypoints — uzyj ich bezposrednio
  if (waypoints.length > 0) {
    const points = [
      { x: sourceX, y: sourceY },
      ...waypoints,
      { x: targetX, y: targetY },
    ];

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      path += ` L ${prev.x} ${midY} L ${curr.x} ${midY} L ${curr.x} ${curr.y}`;
    }
    return path;
  }

  // Automatyczne trasowanie ortogonalne
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  let path = `M ${sourceX} ${sourceY}`;

  if (Math.abs(dx) < 2) {
    // Pionowo — prosta linia
    path += ` L ${targetX} ${targetY}`;
  } else if (dy > NODE_MARGIN) {
    // Target jest nizej — normalne L: w dol, poziomo, w dol
    const midY = sourceY + dy / 2;
    path += ` L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  } else if (dy < -NODE_MARGIN) {
    // Target jest wyzej — w gore, poziomo, w gore
    const midY = sourceY + dy / 2;
    path += ` L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  } else {
    // Target jest mniej wiecej na tym samym poziomie lub blisko
    // Musimy wyjsc do gory lub dolu zeby ominac elementy
    const escapeY = Math.min(sourceY, targetY) - NODE_MARGIN;
    path += ` L ${sourceX} ${escapeY} L ${targetX} ${escapeY} L ${targetX} ${targetY}`;
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

  const midIdx = Math.floor(points.length / 2);
  const a = points[midIdx - 1] ?? points[0];
  const b = points[midIdx] ?? points[points.length - 1];

  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}
