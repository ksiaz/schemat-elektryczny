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
import { BusbarNode } from './ac/BusbarNode.tsx';
import { HybridInverterNode } from './ac/HybridInverterNode.tsx';
import { EnclosureNode } from './enclosures/EnclosureNode.tsx';
import { PvStringNode } from './dc/PvStringNode.tsx';
import { SpdDcNode } from './dc/SpdDcNode.tsx';
import { DcDisconnectNode } from './dc/DcDisconnectNode.tsx';
import { FuseGpvNode } from './dc/FuseGpvNode.tsx';
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
  busbar: BusbarNode,
  hybridInverter: HybridInverterNode,
  // Rozdzielnice
  enclosure: EnclosureNode,
  // DC
  pvString: PvStringNode,
  spdDc: SpdDcNode,
  dcDisconnect: DcDisconnectNode,
  fuseGpv: FuseGpvNode,
  // EV
  evCharger: EvChargerNode,
  // Przelaczniki
  transferSwitch: TransferSwitchNode,
} as const;
