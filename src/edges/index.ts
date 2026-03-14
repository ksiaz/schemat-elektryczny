import { MultilineAcEdge } from './MultilineAcEdge.tsx';
import { DcLineEdge } from './DcLineEdge.tsx';
import { CableEdge } from './CableEdge.tsx';
import { DcPlusEdge } from './DcPlusEdge.tsx';
import { DcMinusEdge } from './DcMinusEdge.tsx';

export const edgeTypes = {
  multilineAc: MultilineAcEdge,
  dcLine: DcLineEdge,
  cable: CableEdge,
  dcPlus: DcPlusEdge,
  dcMinus: DcMinusEdge,
} as const;
