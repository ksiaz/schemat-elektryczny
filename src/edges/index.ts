import { MultilineAcEdge } from './MultilineAcEdge.tsx';
import { DcLineEdge } from './DcLineEdge.tsx';
import { CableEdge } from './CableEdge.tsx';

export const edgeTypes = {
  multilineAc: MultilineAcEdge,
  dcLine: DcLineEdge,
  cable: CableEdge,
} as const;
