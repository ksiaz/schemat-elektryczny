import type { SchematicTemplate } from './types.ts';
import { makeNode, makeEdge, nodeId, resetCounter } from './helpers.ts';

// Szablon: Instalacja 3-fazowa ON-grid
export const onGrid3Phase: SchematicTemplate = {
  id: 'on-grid-3phase',
  name: 'Instalacja 3-faz. ON-grid',
  description: 'Panele PV → Falownik 3-faz → Zabezpieczenia AC → Rozdzielnica główna → Sieć',

  generate() {
    resetCounter();

    // IDs
    const pvStr1 = nodeId('pv');
    const pvStr2 = nodeId('pv');
    const spdDc = nodeId('spd-dc');
    const dcDisc = nodeId('dc-disc');
    const inverter = nodeId('inv');
    const spdAc = nodeId('spd-ac');
    const rcd = nodeId('rcd');
    const mcb = nodeId('mcb');
    const meter = nodeId('meter');
    const mainSwitch = nodeId('main-sw');
    const ground = nodeId('ground');
    const enclosure = nodeId('encl');

    // Pozycje (uklad pionowy, od gory)
    const cx = 300; // srodek
    const nodes = [
      // Stringi PV
      makeNode(pvStr1, 'pvString', cx - 80, 30, {
        label: 'PV1', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 12, model: '', vString: 480, pString: 5000 },
      }),
      makeNode(pvStr2, 'pvString', cx + 80, 30, {
        label: 'PV2', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 12, model: '', vString: 480, pString: 5000 },
      }),

      // SPD DC
      makeNode(spdDc, 'spdDc', cx - 80, 130, {
        label: 'SPD-DC', elementId: 'spd_dc', designation: 'F-SPD',
        parameters: { spdType: 'T2', uc: 1000, in: 20, imax: 40 },
      }),

      // Rozlacznik DC
      makeNode(dcDisc, 'dcDisconnect', cx + 80, 130, {
        label: 'QS1', elementId: 'dc_disconnect', designation: 'QS',
        parameters: { voltage: 1000, ratingCurrent: 25 },
      }),

      // Falownik
      makeNode(inverter, 'inverter', cx, 230, {
        label: 'U1', elementId: 'inverter', designation: 'U',
        parameters: { model: '', power: 10, mppt: 2, type: 'ON-grid' },
      }),

      // Rozdzielnica (kontener)
      makeNode(enclosure, 'enclosure', cx - 60, 340, {
        label: 'RPV-AC', elementId: 'pv_ac_enclosure', designation: 'RPV-AC',
        parameters: { modules: 12, ip: 'IP65' },
      }, { style: { width: 220, height: 280 } }),

      // Elementy w rozdzielnicy
      makeNode(spdAc, 'spdAc', 20, 50, {
        label: 'SPD-AC', elementId: 'spd_ac', designation: 'F-SPD',
        parameters: { spdType: 'T2', config: '3+1', uc: 275 },
      }, { parentId: enclosure, extent: 'parent' as const }),

      makeNode(rcd, 'rcd', 90, 50, {
        label: 'F-RCD1', elementId: 'rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 40, sensitivityCurrent: 300, poles: '4P' },
      }, { parentId: enclosure, extent: 'parent' as const }),

      makeNode(mcb, 'mcb', 160, 50, {
        label: 'F1', elementId: 'mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 25, poles: '4P' },
      }, { parentId: enclosure, extent: 'parent' as const }),

      // Licznik
      makeNode(meter, 'meter', cx, 660, {
        label: 'P1', elementId: 'meter', designation: 'P',
        parameters: { model: '', meterType: '3-fazowy', bidirectional: 'Tak' },
      }),

      // Wylacznik glowny
      makeNode(mainSwitch, 'mainSwitch', cx, 750, {
        label: 'Q1', elementId: 'main_switch', designation: 'Q',
        parameters: { ratingCurrent: 63, poles: '4P' },
      }),

      // Uziom
      makeNode(ground, 'ground', cx + 150, 750, {
        label: 'Uziom', elementId: 'ground_rod', designation: '',
        parameters: { resistance: 10, groundType: 'pionowy' },
      }),
    ];

    const edges = [
      // DC
      makeEdge(pvStr1, spdDc, 'dcLine', 'out', 'in', { stringLabel: 'PV1', cableType: 'PV1-F', cableSection: '2x4' }),
      makeEdge(pvStr2, dcDisc, 'dcLine', 'out', 'in', { stringLabel: 'PV2', cableType: 'PV1-F', cableSection: '2x4' }),
      makeEdge(spdDc, inverter, 'dcLine', 'out', 'dc-in'),
      makeEdge(dcDisc, inverter, 'dcLine', 'out', 'dc-in'),

      // AC
      makeEdge(inverter, enclosure, 'multilineAc', 'ac-out', 'in', { cableType: 'YDYżo', cableSection: '5x4', cableLength: '5m' }),
      makeEdge(enclosure, meter, 'multilineAc', 'out', 'in', { cableType: 'YDYżo', cableSection: '5x10' }),
      makeEdge(meter, mainSwitch, 'multilineAc', 'out', 'in'),
    ];

    return { nodes, edges };
  },
};
