import { MultilineAcEdge } from './MultilineAcEdge.tsx';
import { DcLineEdge } from './DcLineEdge.tsx';
import { CableEdge } from './CableEdge.tsx';
import { DcPlusEdge } from './DcPlusEdge.tsx';
import { DcMinusEdge } from './DcMinusEdge.tsx';
import { PeEdge } from './PeEdge.tsx';

export const edgeTypes = {
  multilineAc: MultilineAcEdge,
  dcLine: DcLineEdge,
  cable: CableEdge,
  dcPlus: DcPlusEdge,
  dcMinus: DcMinusEdge,
  pe: PeEdge,
} as const;
