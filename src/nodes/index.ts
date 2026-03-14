import { InverterNode } from './ac/InverterNode.tsx';
import { RcdNode } from './ac/RcdNode.tsx';
import { McbNode } from './ac/McbNode.tsx';
import { RcboNode } from './ac/RcboNode.tsx';
import { AcBusbarNode } from './ac/AcBusbarNode.tsx';
import { GroundNode } from './ac/GroundNode.tsx';
import { SpdAcNode } from './ac/SpdAcNode.tsx';
import { MeterNode } from './ac/MeterNode.tsx';
import { MainSwitchNode } from './ac/MainSwitchNode.tsx';
import { ContactorNode } from './ac/ContactorNode.tsx';
import { FireButtonNode } from './ac/FireButtonNode.tsx';
import { Socket32Node } from './ac/Socket32Node.tsx';
import { ZugNNode } from './ac/ZugNNode.tsx';
import { Zug2NNode } from './ac/Zug2NNode.tsx';
import { ZugL1Node } from './ac/ZugL1Node.tsx';
import { ZugL2Node } from './ac/ZugL2Node.tsx';
import { ZugL3Node } from './ac/ZugL3Node.tsx';
import { CtNode } from './ac/CtNode.tsx';
import { MeterOsdNode } from './ac/MeterOsdNode.tsx';
import { PhaseMonitorNode } from './ac/PhaseMonitorNode.tsx';
import { WirePointNode } from './ac/WirePointNode.tsx';
import { TextLabelNode } from './ac/TextLabelNode.tsx';
import { DistBlockNode } from './ac/DistBlockNode.tsx';
import { BusbarNode } from './ac/BusbarNode.tsx';
import { HybridInverterNode } from './ac/HybridInverterNode.tsx';
import { EnclosureNode } from './enclosures/EnclosureNode.tsx';
import { BlackBoxNode } from './enclosures/BlackBoxNode.tsx';
import { PvStringNode } from './dc/PvStringNode.tsx';
import { SpdDcNode } from './dc/SpdDcNode.tsx';
import { DcDisconnectNode } from './dc/DcDisconnectNode.tsx';
import { FuseGpvNode } from './dc/FuseGpvNode.tsx';
import { BatteryNode } from './dc/BatteryNode.tsx';
import { EvChargerNode } from './ev/EvChargerNode.tsx';
import { TransferSwitchNode } from './transfer/TransferSwitchNode.tsx';

export const nodeTypes = {
  // AC
  inverter: InverterNode,
  rcd: RcdNode,
  mcb: McbNode,
  rcbo: RcboNode,
  acBusbar: AcBusbarNode,
  ground: GroundNode,
  spdAc: SpdAcNode,
  meter: MeterNode,
  mainSwitch: MainSwitchNode,
  contactor: ContactorNode,
  fireButton: FireButtonNode,
  socket32: Socket32Node,
  zugN: ZugNNode,
  zug2N: Zug2NNode,
  zugL1: ZugL1Node,
  zugL2: ZugL2Node,
  zugL3: ZugL3Node,
  ct: CtNode,
  meterOsd: MeterOsdNode,
  phaseMonitor: PhaseMonitorNode,
  wirePoint: WirePointNode,
  textLabel: TextLabelNode,
  distBlock: DistBlockNode,
  busbar: BusbarNode,
  hybridInverter: HybridInverterNode,
  // Rozdzielnice
  enclosure: EnclosureNode,
  blackBox: BlackBoxNode,
  // DC
  pvString: PvStringNode,
  spdDc: SpdDcNode,
  dcDisconnect: DcDisconnectNode,
  fuseGpv: FuseGpvNode,
  battery: BatteryNode,
  // EV
  evCharger: EvChargerNode,
  // Przelaczniki
  transferSwitch: TransferSwitchNode,
} as const;
