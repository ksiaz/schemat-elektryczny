import type { SchematicTemplate } from './types.ts';
import { makeNode, makeEdge, nodeId, resetCounter } from './helpers.ts';

// Szablon: Instalacja z ladowarka EV
export const withEvCharger: SchematicTemplate = {
  id: 'with-ev-charger',
  name: 'Instalacja z ładowarką EV',
  description: 'PV ON-grid 3-faz + dedykowana linia dla ładowarki EV z RCD typ B',

  generate() {
    resetCounter();

    const pvStr = nodeId('pv');
    const inverter = nodeId('inv');
    const mcbPv = nodeId('mcb');
    const meter = nodeId('meter');
    const mainSw = nodeId('main-sw');
    const enclosure = nodeId('encl');
    const rcdEv = nodeId('rcd-ev');
    const mcbEv = nodeId('mcb-ev');
    const evCharger = nodeId('ev');
    const ground = nodeId('ground');

    const cx = 300;
    const nodes = [
      // PV
      makeNode(pvStr, 'pvString', cx, 30, {
        label: 'PV1', elementId: 'pv_string', designation: 'PV',
        parameters: { panelCount: 15, model: '', vString: 600, pString: 6500 },
      }),

      makeNode(inverter, 'inverter', cx, 130, {
        label: 'U1', elementId: 'inverter', designation: 'U',
        parameters: { model: '', power: 8, mppt: 2, type: 'ON-grid' },
      }),

      makeNode(mcbPv, 'mcb', cx, 230, {
        label: 'F1', elementId: 'mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 25, poles: '4P' },
      }),

      makeNode(meter, 'meter', cx, 320, {
        label: 'P1', elementId: 'meter', designation: 'P',
        parameters: { model: '', meterType: '3-fazowy', bidirectional: 'Tak' },
      }),

      // Rozdzielnica glowna
      makeNode(enclosure, 'enclosure', cx - 80, 420, {
        label: 'RG', elementId: 'main_enclosure', designation: 'RG',
        parameters: { modules: 24, ip: 'IP30' },
      }, { style: { width: 260, height: 180 } }),

      makeNode(mainSw, 'mainSwitch', 20, 50, {
        label: 'Q1', elementId: 'main_switch', designation: 'Q',
        parameters: { ratingCurrent: 63, poles: '4P' },
      }, { parentId: enclosure, extent: 'parent' as const }),

      // Linia EV w rozdzielnicy
      makeNode(rcdEv, 'rcd', 100, 50, {
        label: 'F-EV', elementId: 'ev_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'B', ratingCurrent: 40, sensitivityCurrent: 30, poles: '4P' },
      }, { parentId: enclosure, extent: 'parent' as const }),

      makeNode(mcbEv, 'mcb', 180, 50, {
        label: 'F2', elementId: 'mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 32, poles: '4P' },
      }, { parentId: enclosure, extent: 'parent' as const }),

      // Ladowarka EV
      makeNode(evCharger, 'evCharger', cx + 120, 650, {
        label: 'EV1', elementId: 'ev_charger', designation: '',
        parameters: { model: '', power: 22, evType: '3-fazowy' },
      }),

      // Uziom
      makeNode(ground, 'ground', cx - 120, 650, {
        label: 'Uziom', elementId: 'ground_rod', designation: '',
        parameters: { resistance: 10, groundType: 'pionowy' },
      }),
    ];

    const edges = [
      // PV
      makeEdge(pvStr, inverter, 'dcLine', 'out', 'dc-in', { stringLabel: 'PV1', cableType: 'PV1-F', cableSection: '2x6' }),
      makeEdge(inverter, mcbPv, 'multilineAc', 'ac-out', 'in', { cableType: 'YDYżo', cableSection: '5x4' }),
      makeEdge(mcbPv, meter, 'multilineAc', 'out', 'in'),
      makeEdge(meter, enclosure, 'multilineAc', 'out', 'in', { cableType: 'YDYżo', cableSection: '5x10' }),
      // EV
      makeEdge(enclosure, evCharger, 'cable', 'out', 'in', { cableType: 'YKY', cableSection: '5x6', cableLength: '15m' }),
    ];

    return { nodes, edges };
  },
};
