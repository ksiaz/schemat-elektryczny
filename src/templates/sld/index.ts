import { onGrid1PhaseSld } from './onGrid1Phase.ts';
import { onGrid3PhaseSld } from './onGrid3Phase.ts';
import { hybridSld } from './hybrid.ts';
import type { SldTemplate } from './types.ts';

export const SLD_TEMPLATES: SldTemplate[] = [
  onGrid1PhaseSld,
  onGrid3PhaseSld,
  hybridSld,
];

export type { SldTemplate };
