import { create } from 'zustand';

// Ulotny store geometrii kabli SLD — NIE czesc projektu (poza zapisem/undo).
// Kazdy SingleLineCableEdge raportuje tu swoja polilinie (wsp. flow), a nakladka
// SldConnectionOverlay liczy z tego wezly (kolka) i skrzyzowania (omijki).

export type Pt = { x: number; y: number };
export interface EdgeGeom { pts: Pt[]; color: string; label: string[] }

interface GeomState {
  geom: Record<string, EdgeGeom>;
  report: (id: string, pts: Pt[], color: string, label: string[]) => void;
  remove: (id: string) => void;
}

export const useSldGeomStore = create<GeomState>((set) => ({
  geom: {},
  report: (id, pts, color, label) => set((s) => ({ geom: { ...s.geom, [id]: { pts, color, label } } })),
  remove: (id) => set((s) => {
    if (!(id in s.geom)) return s;
    const geom = { ...s.geom };
    delete geom[id];
    return { geom };
  }),
}));
