import type { SchematicTemplate } from './types.ts';
import { makeNode, makeEdge, nodeId, resetCounter } from './helpers.ts';

// Szablon: Hybryda z magazynem energii
export const hybrid: SchematicTemplate = {
  id: 'hybrid',
  name: 'Hybryda z magazynem energii',
  description: 'Panele PV → Falownik hybrydowy → Bateria + Sieć + Odbiory krytyczne',

  generate() {
    resetCounter();

    const pvStr1 = nodeId('pv');
    const pvStr2 = nodeId('pv');
    const inverter = nodeId('inv');
    const battery = nodeId('bat');
    const transferSw = nodeId('szr');
    const mcb1 = nodeId('mcb');
    const rcd = nodeId('rcd');
    const meter = nodeId('meter');
    const mainSw = nodeId('main-sw');
    const ground = nodeId('ground');

    const cx = 300;
    const nodes = [
      // Stringi PV
      makeNode(pvStr1, 'pvString', cx - 60, 30, {
        label: 'PV1', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 10, model: '', vString: 400, pString: 4500 },
      }),
      makeNode(pvStr2, 'pvString', cx + 60, 30, {
        label: 'PV2', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 10, model: '', vString: 400, pString: 4500 },
      }),

      // Falownik hybrydowy
      makeNode(inverter, 'inverter', cx, 160, {
        label: 'U1', elementId: 'inverter', designation: 'U',
        parameters: { model: '', power: 10, mppt: 2, type: 'Hybryda' },
      }),

      // Bateria (po lewej)
      makeNode(battery, 'pvString', cx - 150, 160, {
        label: 'BAT', elementId: 'pv_string', designation: 'G',
        parameters: { panelCount: 1, model: 'Magazyn energii', vString: 48 },
      }),

      // Przelacznik zasilania
      makeNode(transferSw, 'transferSwitch', cx, 280, {
        label: 'SZR', elementId: 'transfer_switch', designation: 'Q',
        parameters: { switchType: 'automatyczny', ratingCurrent: 63, poles: '4P' },
      }),

      // Zabezpieczenia
      makeNode(mcb1, 'mcb', cx, 370, {
        label: 'F1', elementId: 'mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 32, poles: '4P' },
      }),

      makeNode(rcd, 'rcd', cx, 460, {
        label: 'F-RCD1', elementId: 'rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 40, sensitivityCurrent: 300, poles: '4P' },
      }),

      // Licznik
      makeNode(meter, 'meter', cx, 560, {
        label: 'P1', elementId: 'meter', designation: 'P',
        parameters: { model: '', meterType: '3-fazowy', bidirectional: 'Tak' },
      }),

      // Wylacznik glowny
      makeNode(mainSw, 'mainSwitch', cx, 650, {
        label: 'Q1', elementId: 'main_switch', designation: 'Q',
        parameters: { ratingCurrent: 63, poles: '4P' },
      }),

      // Uziom
      makeNode(ground, 'ground', cx + 150, 650, {
        label: 'Uziom', elementId: 'ground_rod', designation: '',
        parameters: { resistance: 10, groundType: 'pionowy' },
      }),
    ];

    const edges = [
      makeEdge(pvStr1, inverter, 'dcLine', 'out', 'dc-in', { stringLabel: 'PV1' }),
      makeEdge(pvStr2, inverter, 'dcLine', 'out', 'dc-in', { stringLabel: 'PV2' }),
      makeEdge(battery, inverter, 'dcLine', 'out', 'dc-in', { stringLabel: 'BAT' }),
      makeEdge(inverter, transferSw, 'multilineAc', 'ac-out', 'in-1'),
      makeEdge(transferSw, mcb1, 'multilineAc', 'out', 'in'),
      makeEdge(mcb1, rcd, 'multilineAc', 'out', 'in'),
      makeEdge(rcd, meter, 'multilineAc', 'out', 'in'),
      makeEdge(meter, mainSw, 'multilineAc', 'out', 'in'),
    ];

    return { nodes, edges };
  },
};
