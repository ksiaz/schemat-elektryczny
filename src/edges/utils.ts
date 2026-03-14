// Proste ortogonalne sciezki — pionowo, poziomo, pionowo

export interface Waypoint {
  x: number;
  y: number;
}

const EXIT_OFFSET = 20; // odskok od elementu przed skretem

export function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): string {
  // Reczne waypoints
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

  // Prosta pionowa
  if (dx < 5) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  // Prosta pozioma
  if (Math.abs(dy) < 5) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  // Target nizej — normalne: w dol, poziomo, w dol
  if (dy > EXIT_OFFSET * 2) {
    const midY = sourceY + dy / 2;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  }

  // Target wyzej — normalne: w gore, poziomo, w gore
  if (dy < -EXIT_OFFSET * 2) {
    const midY = sourceY + dy / 2;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  }

  // Blisko siebie — odskok: source wychodzi w dol (lub gore), potem poziomo, potem target
  // Decyzja kierunku: jesli target jest troche nizej/na tym samym poziomie,
  // source wychodzi w DOL, target wchodzi z GORY
  if (dy >= 0) {
    const exitY = Math.max(sourceY, targetY) + EXIT_OFFSET;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${exitY} L ${targetX} ${exitY} L ${targetX} ${targetY}`;
  } else {
    const exitY = Math.min(sourceY, targetY) - EXIT_OFFSET;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${exitY} L ${targetX} ${exitY} L ${targetX} ${targetY}`;
  }
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
