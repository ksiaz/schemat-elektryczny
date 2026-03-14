// Narzedzia do budowania sciezek z waypointami i omijaniem wezlow

export interface Waypoint {
  x: number;
  y: number;
}

export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MARGIN = 25; // odstep od krawedzi wezla

// Sprawdza czy odcinek poziomy (y=constY, od x1 do x2) przecina prostokat
function hLineIntersectsRect(y: number, x1: number, x2: number, rect: NodeRect): boolean {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  return (
    y > rect.y - MARGIN &&
    y < rect.y + rect.height + MARGIN &&
    maxX > rect.x - MARGIN &&
    minX < rect.x + rect.width + MARGIN
  );
}

// Buduje sciezke ortogonalna omijajaca wezly
export function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
  _obstacles: NodeRect[] = [],
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
      // Pionowo do polowy, poziomo, pionowo do celu
      const midY = (prev.y + curr.y) / 2;
      path += ` L ${prev.x} ${midY} L ${curr.x} ${midY} L ${curr.x} ${curr.y}`;
    }
    return path;
  }

  // Automatyczne trasowanie
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  // Prosta linia pionowa
  if (Math.abs(dx) < 3) {
    return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  }

  // Normalne L: source w dol -> poziomo -> w dol do target
  if (dy > 60) {
    const midY = sourceY + dy / 2;
    // Sprawdz czy linia pozioma przecina jakis wezel
    const blocked = _obstacles.some(r => hLineIntersectsRect(midY, sourceX, targetX, r));
    if (!blocked) {
      return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
    }
    // Zablokowane — idz dalej w dol zeby ominac
    const safeY = Math.max(..._obstacles.filter(r => hLineIntersectsRect(midY, sourceX, targetX, r)).map(r => r.y + r.height)) + MARGIN;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${safeY} L ${targetX} ${safeY} L ${targetX} ${targetY}`;
  }

  // Target jest wyzej lub na tym samym poziomie — wyjdz do gory
  if (dy < -60) {
    const midY = sourceY + dy / 2;
    const blocked = _obstacles.some(r => hLineIntersectsRect(midY, sourceX, targetX, r));
    if (!blocked) {
      return `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
    }
    const safeY = Math.min(..._obstacles.filter(r => hLineIntersectsRect(midY, sourceX, targetX, r)).map(r => r.y)) - MARGIN;
    return `M ${sourceX} ${sourceY} L ${sourceX} ${safeY} L ${targetX} ${safeY} L ${targetX} ${targetY}`;
  }

  // Blisko siebie — uciekaj do gory
  const escapeY = Math.min(sourceY, targetY) - 50;
  return `M ${sourceX} ${sourceY} L ${sourceX} ${escapeY} L ${targetX} ${escapeY} L ${targetX} ${targetY}`;
}

// Oblicz punkt srodkowy sciezki (do etykiety)
export function getMidpoint(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  waypoints: Waypoint[] = [],
): { x: number; y: number } {
  if (waypoints.length > 0) {
    const points = [
      { x: sourceX, y: sourceY },
      ...waypoints,
      { x: targetX, y: targetY },
    ];
    const midIdx = Math.floor(points.length / 2);
    const a = points[midIdx - 1] ?? points[0];
    const b = points[midIdx] ?? points[points.length - 1];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  return {
    x: (sourceX + targetX) / 2,
    y: Math.min(sourceY, targetY) + Math.abs(targetY - sourceY) / 2,
  };
}
