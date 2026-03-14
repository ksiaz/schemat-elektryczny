import { BuildingNode } from './layout/BuildingNode.tsx';
import { RoofNode } from './layout/RoofNode.tsx';
import { PvPanelLayoutNode } from './layout/PvPanelLayoutNode.tsx';
import { DeviceIconNode } from './layout/DeviceIconNode.tsx';
import { CableRouteNode } from './layout/CableRouteNode.tsx';
import { LineNode } from './layout/LineNode.tsx';
import { RulerNode } from './layout/RulerNode.tsx';
import { CompassNode } from './layout/CompassNode.tsx';
import { LegendNode } from './layout/LegendNode.tsx';
import { FreeLineNode } from './layout/FreeLineNode.tsx';

export const layoutNodeTypes = {
  building: BuildingNode,
  roof: RoofNode,
  pvPanelLayout: PvPanelLayoutNode,
  deviceIcon: DeviceIconNode,
  cableRoute: CableRouteNode,
  layoutLine: LineNode,
  ruler: RulerNode,
  compass: CompassNode,
  legend: LegendNode,
  freeLine: FreeLineNode,
} as const;
