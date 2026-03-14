import { DcLineEdge } from './DcLineEdge.tsx';
import { CableEdge } from './CableEdge.tsx';
import { DcPlusEdge } from './DcPlusEdge.tsx';
import { DcMinusEdge } from './DcMinusEdge.tsx';
import { PeEdge } from './PeEdge.tsx';
import { AcL1Edge } from './AcL1Edge.tsx';
import { AcL2Edge } from './AcL2Edge.tsx';
import { AcL3Edge } from './AcL3Edge.tsx';
import { AcNEdge } from './AcNEdge.tsx';
import { StraightLineEdge } from './StraightLineEdge.tsx';

export const edgeTypes = {
  multilineAc: CableEdge,  // kompatybilnosc wsteczna — stare rysunki
  dcLine: DcLineEdge,
  cable: CableEdge,
  dcPlus: DcPlusEdge,
  dcMinus: DcMinusEdge,
  pe: PeEdge,
  acL1: AcL1Edge,
  acL2: AcL2Edge,
  acL3: AcL3Edge,
  acN: AcNEdge,
  straightLine: StraightLineEdge,
} as const;
