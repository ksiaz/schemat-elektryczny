import { onGrid3Phase } from './onGrid3Phase.ts';
import { onGrid1Phase } from './onGrid1Phase.ts';
import { hybrid } from './hybrid.ts';
import { withEvCharger } from './withEvCharger.ts';
import type { SchematicTemplate } from './types.ts';

export const TEMPLATES: SchematicTemplate[] = [
  onGrid3Phase,
  onGrid1Phase,
  hybrid,
  withEvCharger,
];
