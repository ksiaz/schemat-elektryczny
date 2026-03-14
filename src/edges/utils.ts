// Proste ortogonalne sciezki — pionowo, poziomo, pionowo
// Styl jak na profesjonalnych schematach elektrycznych

export interface Waypoint {
  x: number;
  y: number;
}

// Sciezka: source → pionowo do midY → poziomo do targetX → pionowo do target
// midY jest w polowie miedzy source a target (lub odskok jesli blisko siebie)
export function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): string {
  // Reczne waypoints — uzyj bezposrednio
  if (waypoints.length > 0) {
    const pts = [{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }];
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  }

  const dx = Math.abs(targetX - sourceX);
  const dy = targetY - sourceY;

  // Prosta pionowa — elementy nad soba
  if (dx < 5) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  // Prosta pozioma — elementy obok siebie
  if (Math.abs(dy) < 5) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  // Standardowe L: pionowo w dol do polowy, poziomo, pionowo do celu
  const midY = sourceY + dy / 2;
  return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
}

// Punkt srodkowy sciezki (do etykiety)
export function getMidpoint(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): { x: number; y: number } {
  if (waypoints.length > 0) {
    const pts = [{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }];
    const midIdx = Math.floor(pts.length / 2);
    return {
      x: (pts[midIdx - 1].x + pts[midIdx].x) / 2,
      y: (pts[midIdx - 1].y + pts[midIdx].y) / 2,
    };
  }

  return {
    x: (sourceX + targetX) / 2,
    y: sourceY + (targetY - sourceY) / 2,
  };
}
