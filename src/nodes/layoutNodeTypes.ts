import { BuildingNode } from './layout/BuildingNode.tsx';
import { RoofNode } from './layout/RoofNode.tsx';
import { PvPanelLayoutNode } from './layout/PvPanelLayoutNode.tsx';
import { DeviceIconNode } from './layout/DeviceIconNode.tsx';
import { CableRouteNode } from './layout/CableRouteNode.tsx';

export const layoutNodeTypes = {
  building: BuildingNode,
  roof: RoofNode,
  pvPanelLayout: PvPanelLayoutNode,
  deviceIcon: DeviceIconNode,
  cableRoute: CableRouteNode,
} as const;
