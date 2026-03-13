import type { SchematicTemplate } from './types.ts';
import { makeNode, makeEdge, nodeId, resetCounter } from './helpers.ts';

// Szablon: Instalacja 1-fazowa ON-grid
export const onGrid1Phase: SchematicTemplate = {
  id: 'on-grid-1phase',
  name: 'Instalacja 1-faz. ON-grid',
  description: 'Panele PV → Falownik 1-faz → MCB + RCD → Licznik → Sieć',

  generate() {
    resetCounter();

    const pvStr = nodeId('pv');
    const inverter = nodeId('inv');
    const mcb = nodeId('mcb');
    const rcd = nodeId('rcd');
    const meter = nodeId('meter');
    const mainSw = nodeId('main-sw');
    const ground = nodeId('ground');

    const cx = 250;
    const nodes = [
      makeNode(pvStr, 'pvString', cx, 30, {
        label: 'PV1', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 8, model: '', vString: 320, pString: 3200 },
      }),

      makeNode(inverter, 'inverter', cx, 130, {
        label: 'U1', elementId: 'inverter', designation: 'U',
        parameters: { model: '', power: 3, mppt: 1, type: 'ON-grid' },
      }),

      makeNode(mcb, 'mcb', cx, 230, {
        label: 'F1', elementId: 'mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 16, poles: '2P' },
      }),

      makeNode(rcd, 'rcd', cx, 320, {
        label: 'F-RCD1', elementId: 'rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 25, sensitivityCurrent: 30, poles: '2P' },
      }),

      makeNode(meter, 'meter', cx, 420, {
        label: 'P1', elementId: 'meter', designation: 'P',
        parameters: { model: '', meterType: '1-fazowy', bidirectional: 'Tak' },
      }),

      makeNode(mainSw, 'mainSwitch', cx, 510, {
        label: 'Q1', elementId: 'main_switch', designation: 'Q',
        parameters: { ratingCurrent: 32, poles: '2P' },
      }),

      makeNode(ground, 'ground', cx + 120, 510, {
        label: 'Uziom', elementId: 'ground_rod', designation: '',
        parameters: { resistance: 10, groundType: 'pionowy' },
      }),
    ];

    const edges = [
      makeEdge(pvStr, inverter, 'dcLine', 'out', 'dc-in', { stringLabel: 'PV1', cableType: 'PV1-F', cableSection: '2x4' }),
      makeEdge(inverter, mcb, 'cable', 'ac-out', 'in', { cableType: 'YDY', cableSection: '3x2.5' }),
      makeEdge(mcb, rcd, 'cable', 'out', 'in'),
      makeEdge(rcd, meter, 'cable', 'out', 'in'),
      makeEdge(meter, mainSw, 'cable', 'out', 'in'),
    ];

    return { nodes, edges };
  },
};
