import type { SldTemplate } from './types.ts';
import { makeNode, makeCable, nodeId, resetCounter } from './helpers.ts';

export const onGrid1PhaseSld: SldTemplate = {
  id: 'sld-on-grid-1phase',
  name: 'SLD — PV 1-faz. ON-grid',
  description: 'Sieć 230V → ZK → licznik 2-kier → PWP → Q1 → RG → RPV-AC → inwerter → DC → string',

  generate() {
    resetCounter();

    const grid = nodeId('grid');
    const zk = nodeId('zk');
    const boundary = nodeId('boundary');
    const meter = nodeId('meter');
    const pwp = nodeId('pwp');
    const q1 = nodeId('q1');
    const f1 = nodeId('f1');
    const rcd = nodeId('rcd');
    const spdAc = nodeId('spdac');
    const fpv = nodeId('fpv');
    const spdPvAc = nodeId('spdpvac');
    const inv = nodeId('inv');
    const qsdc = nodeId('qsdc');
    const fgpv = nodeId('fgpv');
    const spdDc = nodeId('spddc');
    const pv = nodeId('pv');
    const gnd = nodeId('gnd');

    const cx = 300;

    const nodes = [
      makeNode(grid, 'sldGridSource', cx, 0, {
        label: 'Sieć', elementId: 'sld_grid_source', designation: '',
        parameters: { network: '~/N/PE 230 V 50 Hz' },
      }),
      makeNode(zk, 'sldCableJunction', cx, 80, {
        label: 'ZK', elementId: 'sld_cable_junction', designation: 'ZK',
        parameters: {},
      }),
      makeNode(boundary, 'sldOsdBoundary', cx - 100, 130, {
        label: '', elementId: 'sld_osd_boundary', designation: '',
        parameters: { label: 'Granica własności OSD' },
      }),
      makeNode(meter, 'sldMeter', cx, 160, {
        label: 'P1', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '2-kier', phases: '1' },
      }),
      makeNode(pwp, 'sldFireSwitch', cx, 240, {
        label: 'PWP', elementId: 'sld_fire_switch', designation: 'F-PWP',
        parameters: {},
      }),
      makeNode(q1, 'sldMainSwitch', cx, 320, {
        label: 'Q1', elementId: 'sld_main_switch', designation: 'Q',
        parameters: { poles: '2P', ratingCurrent: 40 },
      }),
      makeNode(f1, 'sldMcb', cx - 80, 400, {
        label: 'F1', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '1P' },
      }),
      makeNode(rcd, 'sldRcd', cx - 80, 480, {
        label: 'F-RCD1', elementId: 'sld_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'A', ratingCurrent: 25, sensitivityCurrent: 30, poles: '2P' },
      }),
      makeNode(spdAc, 'sldSpdAc', cx + 80, 400, {
        label: 'F-SPD1', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(fpv, 'sldMcb', cx, 480, {
        label: 'F2', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '1P' },
      }),
      makeNode(spdPvAc, 'sldSpdAc', cx + 80, 480, {
        label: 'F-SPD2', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(inv, 'sldInverter', cx, 560, {
        label: 'U1', elementId: 'sld_inverter', designation: 'U',
        parameters: { type: 'string', power: 3, mppt: 1 },
      }),
      makeNode(qsdc, 'sldDcDisconnect', cx, 660, {
        label: 'QS1', elementId: 'sld_dc_disconnect', designation: 'QS',
        parameters: { poles: '2P', ratingCurrent: 25, ratingVoltage: 1000 },
      }),
      makeNode(fgpv, 'sldFuseGpv', cx - 60, 740, {
        label: 'F3', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(spdDc, 'sldSpdDc', cx + 60, 740, {
        label: 'F-SPD3', elementId: 'sld_spd_dc', designation: 'F-SPD',
        parameters: { spdClass: 'T1+2', uc: 600 },
      }),
      makeNode(pv, 'sldPvString', cx, 820, {
        label: 'PV1', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 8, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(gnd, 'sldGround', cx + 160, 320, {
        label: '', elementId: 'sld_ground', designation: '',
        parameters: { re: 10 },
      }),
    ];

    const ac = (source: string, target: string, cores: number, cross: number, circuit?: string, len?: number) =>
      makeCable(source, target, { cableType: 'YKY', cores, crossSection: cross, circuitId: circuit, length: len, current: 'AC' });

    const dc = (source: string, target: string, len?: number) =>
      makeCable(source, target, { cableType: 'H1Z2Z2-K', cores: 1, crossSection: 6, length: len, current: 'DC' });

    const edges = [
      ac(grid, zk, 3, 10, 'W0', 5),
      ac(zk, meter, 3, 10, undefined, 5),
      ac(meter, pwp, 3, 6),
      ac(pwp, q1, 3, 6),
      ac(q1, f1, 3, 6, 'W1', 5),
      ac(f1, rcd, 3, 6),
      ac(q1, fpv, 3, 6, 'W-PV', 8),
      ac(fpv, inv, 3, 6),
      dc(inv, qsdc, 0.5),
      dc(qsdc, fgpv, 0.5),
      dc(fgpv, pv, 12),
    ];

    return { nodes, edges };
  },
};
