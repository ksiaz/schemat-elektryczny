import { createElement, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import { useUpdateNodeInternals } from '@xyflow/react';
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
import { SmartMeterNode } from './ac/SmartMeterNode.tsx';
import { WirePointNode } from './ac/WirePointNode.tsx';
import { JunctionPointNode } from './ac/JunctionPointNode.tsx';
import { SingleLineMcbNode } from './ac/SingleLineMcbNode.tsx';
import { IsolatorNode } from './ac/IsolatorNode.tsx';
import { InfoFrameNode } from './ac/InfoFrameNode.tsx';
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
// SLD — Single Line Diagram
import { SldGridSourceNode } from './sld/SldGridSourceNode.tsx';
import { SldCableJunctionNode } from './sld/SldCableJunctionNode.tsx';
import { SldMeterNode } from './sld/SldMeterNode.tsx';
import { SldCtNode } from './sld/SldCtNode.tsx';
import { SldMainSwitchNode } from './sld/SldMainSwitchNode.tsx';
import { SldFireSwitchNode } from './sld/SldFireSwitchNode.tsx';
import { SldMcbNode } from './sld/SldMcbNode.tsx';
import { SldRcdNode } from './sld/SldRcdNode.tsx';
import { SldRcboNode } from './sld/SldRcboNode.tsx';
import { SldSpdAcNode } from './sld/SldSpdAcNode.tsx';
import { SldPvStringNode } from './sld/SldPvStringNode.tsx';
import { SldDcDisconnectNode } from './sld/SldDcDisconnectNode.tsx';
import { SldFuseGpvNode } from './sld/SldFuseGpvNode.tsx';
import { SldSpdDcNode } from './sld/SldSpdDcNode.tsx';
import { SldInverterNode } from './sld/SldInverterNode.tsx';
import { SldBatteryNode } from './sld/SldBatteryNode.tsx';
import { SldGroundNode } from './sld/SldGroundNode.tsx';
import { SldOsdBoundaryNode } from './sld/SldOsdBoundaryNode.tsx';
import { SldTransferSwitchNode } from './sld/SldTransferSwitchNode.tsx';
import { SldDistBoardNode } from './sld/SldDistBoardNode.tsx';

// HOC — obrot symbolu o wielokrotnosc 90° wg data.rotation.
// Obrot wokol naroznika (0 0) + kompensacja przesunieciem o szerokosc/wysokosc:
// punkt obrotu lezy na siatce, wiec uchwyty na siatce po obrocie tez sa na siatce.
// updateNodeInternals wymusza ponowny pomiar uchwytow, by przewody podazaly za obrotem.
function withRotation<P extends { id: string; data: { rotation?: number } }>(
  Inner: ComponentType<P>,
): ComponentType<P> {
  return function RotatableNode(props: P) {
    const rotation = ((Number(props.data?.rotation ?? 0) % 360) + 360) % 360;
    const updateNodeInternals = useUpdateNodeInternals();
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      const measure = () => setSize((s) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        return w !== s.w || h !== s.h ? { w, h } : s;
      });
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    useEffect(() => {
      updateNodeInternals(props.id);
    }, [rotation, size.w, size.h, props.id, updateNodeInternals]);

    if (!rotation) {
      return createElement('div', { ref, style: { display: 'inline-block' } }, createElement(Inner, props));
    }

    // przesuniecie kompensujace obrot wokol naroznika (0 0)
    const { w, h } = size;
    const tx = rotation === 90 ? h : rotation === 180 ? w : 0;
    const ty = rotation === 270 ? w : rotation === 180 ? h : 0;

    return createElement(
      'div',
      {
        ref,
        className: 'sld-rotated',
        style: {
          transform: `translate(${tx}px, ${ty}px) rotate(${rotation}deg)`,
          transformOrigin: '0 0',
          display: 'inline-block',
          '--sld-counter-rot': `${-rotation}deg`,
        },
      },
      createElement(Inner, props),
    );
  };
}

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
  smartMeter: SmartMeterNode,
  wirePoint: WirePointNode,
  junctionPoint: JunctionPointNode,
  singleLineMcb: SingleLineMcbNode,
  isolator: IsolatorNode,
  infoFrame: InfoFrameNode,
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
  // SLD — Single Line Diagram (owijane withRotation — obrot o 90°)
  sldGridSource: withRotation(SldGridSourceNode),
  sldCableJunction: withRotation(SldCableJunctionNode),
  sldMeter: withRotation(SldMeterNode),
  sldCt: withRotation(SldCtNode),
  sldMainSwitch: withRotation(SldMainSwitchNode),
  sldFireSwitch: withRotation(SldFireSwitchNode),
  sldMcb: withRotation(SldMcbNode),
  sldRcd: withRotation(SldRcdNode),
  sldRcbo: withRotation(SldRcboNode),
  sldSpdAc: withRotation(SldSpdAcNode),
  sldPvString: withRotation(SldPvStringNode),
  sldDcDisconnect: withRotation(SldDcDisconnectNode),
  sldFuseGpv: withRotation(SldFuseGpvNode),
  sldSpdDc: withRotation(SldSpdDcNode),
  sldInverter: withRotation(SldInverterNode),
  sldBattery: withRotation(SldBatteryNode),
  sldGround: withRotation(SldGroundNode),
  sldOsdBoundary: withRotation(SldOsdBoundaryNode),
  sldTransferSwitch: withRotation(SldTransferSwitchNode),
  sldDistBoard: withRotation(SldDistBoardNode),
} as const;
