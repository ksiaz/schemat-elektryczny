import { BuildingNode } from './layout/BuildingNode.tsx';
import { RoofNode } from './layout/RoofNode.tsx';
import { PvPanelLayoutNode } from './layout/PvPanelLayoutNode.tsx';
import { DeviceIconNode } from './layout/DeviceIconNode.tsx';
import { CableRouteNode } from './layout/CableRouteNode.tsx';
import { LineNode } from './layout/LineNode.tsx';
import { RulerNode } from './layout/RulerNode.tsx';

export const layoutNodeTypes = {
  building: BuildingNode,
  roof: RoofNode,
  pvPanelLayout: PvPanelLayoutNode,
  deviceIcon: DeviceIconNode,
  cableRoute: CableRouteNode,
  layoutLine: LineNode,
  ruler: RulerNode,
} as const;
