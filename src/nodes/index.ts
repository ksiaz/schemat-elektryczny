import { InverterNode } from './ac/InverterNode.tsx';
import { RcdNode } from './ac/RcdNode.tsx';
import { McbNode } from './ac/McbNode.tsx';
import { AcBusbarNode } from './ac/AcBusbarNode.tsx';
import { GroundNode } from './ac/GroundNode.tsx';

export const nodeTypes = {
  inverter: InverterNode,
  rcd: RcdNode,
  mcb: McbNode,
  acBusbar: AcBusbarNode,
  ground: GroundNode,
} as const;
