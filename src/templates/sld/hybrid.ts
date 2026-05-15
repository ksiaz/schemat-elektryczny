import type { SldTemplate } from './types.ts';
import { makeNode, makeCable, nodeId, resetCounter } from './helpers.ts';

export const hybridSld: SldTemplate = {
  id: 'sld-hybrid',
  name: 'SLD — Hybryda PV + magazyn',
  description: 'Sieć 400/230V → licznik OSD 2-kier → PWP → Q1 → inwerter hybrydowy ⇄ bateria, DC → 2 stringi',

  generate() {
    resetCounter();

    const grid = nodeId('grid');
    const zk = nodeId('zk');
    const boundary = nodeId('boundary');
    const meterOsd = nodeId('meter-osd');
    const pwp = nodeId('pwp');
    const q1 = nodeId('q1');
    const f1 = nodeId('f1');
    const rcd = nodeId('rcd');
    const spdAc = nodeId('spdac');
    const meterPv = nodeId('meter-pv');
    const fpv = nodeId('fpv');
    const spdPvAc = nodeId('spdpvac');
    const invH = nodeId('inv-h');
    const bat = nodeId('bat');
    const qsdc = nodeId('qsdc');
    const fgpv1 = nodeId('fgpv1');
    const fgpv2 = nodeId('fgpv2');
    const spdDc = nodeId('spddc');
    const pv1 = nodeId('pv1');
    const pv2 = nodeId('pv2');
    const gnd = nodeId('gnd');

    const cx = 300;

    const nodes = [
      makeNode(grid, 'sldGridSource', cx, 0, {
        label: 'Sieć', elementId: 'sld_grid_source', designation: '',
        parameters: { network: '~3/N/PE 400/230 V 50 Hz' },
      }),
      makeNode(zk, 'sldCableJunction', cx, 80, {
        label: 'ZK', elementId: 'sld_cable_junction', designation: 'ZK',
        parameters: {},
      }),
      makeNode(boundary, 'sldOsdBoundary', cx - 100, 130, {
        label: '', elementId: 'sld_osd_boundary', designation: '',
        parameters: { label: 'Granica własności OSD' },
      }),
      makeNode(meterOsd, 'sldMeter', cx, 160, {
        label: 'P-OSD', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '2-kier', phases: '3' },
      }),
      makeNode(pwp, 'sldFireSwitch', cx, 240, {
        label: 'PWP', elementId: 'sld_fire_switch', designation: 'F-PWP',
        parameters: {},
      }),
      makeNode(q1, 'sldMainSwitch', cx, 320, {
        label: 'Q1', elementId: 'sld_main_switch', designation: 'Q',
        parameters: { poles: '4P', ratingCurrent: 63 },
      }),
      makeNode(f1, 'sldMcb', cx - 100, 400, {
        label: 'F1', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'B', ratingCurrent: 16, poles: '3P' },
      }),
      makeNode(rcd, 'sldRcd', cx - 100, 480, {
        label: 'F-RCD1', elementId: 'sld_rcd', designation: 'F-RCD',
        parameters: { rcdType: 'B', ratingCurrent: 40, sensitivityCurrent: 30, poles: '4P' },
      }),
      makeNode(spdAc, 'sldSpdAc', cx + 100, 400, {
        label: 'F-SPD1', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(meterPv, 'sldMeter', cx, 460, {
        label: 'P-PV', elementId: 'sld_meter', designation: 'P',
        parameters: { direction: '1-kier', phases: '3' },
      }),
      makeNode(fpv, 'sldMcb', cx, 540, {
        label: 'F2', elementId: 'sld_mcb', designation: 'F',
        parameters: { curve: 'C', ratingCurrent: 20, poles: '3P' },
      }),
      makeNode(spdPvAc, 'sldSpdAc', cx + 100, 540, {
        label: 'F-SPD2', elementId: 'sld_spd_ac', designation: 'F-SPD',
        parameters: { spdClass: 'T2', uc: 275 },
      }),
      makeNode(invH, 'sldInverter', cx, 620, {
        label: 'U1', elementId: 'sld_inverter', designation: 'U',
        parameters: { type: 'hybrid', power: 10, mppt: 2 },
      }),
      makeNode(bat, 'sldBattery', cx + 130, 620, {
        label: 'BAT', elementId: 'sld_battery', designation: 'G',
        parameters: { chemistry: 'LiFePO4', capacity: 10, voltage: 48 },
      }),
      makeNode(qsdc, 'sldDcDisconnect', cx, 720, {
        label: 'QS1', elementId: 'sld_dc_disconnect', designation: 'QS',
        parameters: { poles: '4P', ratingCurrent: 25, ratingVoltage: 1000 },
      }),
      makeNode(fgpv1, 'sldFuseGpv', cx - 60, 800, {
        label: 'F3', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(fgpv2, 'sldFuseGpv', cx + 60, 800, {
        label: 'F4', elementId: 'sld_fuse_gpv', designation: 'F',
        parameters: { ratingCurrent: 15, ratingVoltage: 1000 },
      }),
      makeNode(spdDc, 'sldSpdDc', cx + 160, 800, {
        label: 'F-SPD3', elementId: 'sld_spd_dc', designation: 'F-SPD',
        parameters: { spdClass: 'T1+2', uc: 600 },
      }),
      makeNode(pv1, 'sldPvString', cx - 60, 880, {
        label: 'PV1', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(pv2, 'sldPvString', cx + 60, 880, {
        label: 'PV2', elementId: 'sld_pv_string', designation: 'E',
        parameters: { panelCount: 12, voc: 40, isc: 11, mpp: 380 },
      }),
      makeNode(gnd, 'sldGround', cx + 220, 320, {
        label: '', elementId: 'sld_ground', designation: '',
        parameters: { re: 10 },
      }),
    ];

    const ac = (source: string, target: string, cores: number, cross: number, circuit?: string, len?: number) =>
      makeCable(source, target, { cableType: 'YKY', cores, crossSection: cross, circuitId: circuit, length: len, current: 'AC' });

    const dc = (source: string, target: string, len?: number) =>
      makeCable(source, target, { cableType: 'H1Z2Z2-K', cores: 1, crossSection: 6, length: len, current: 'DC' });

    const edges = [
      ac(grid, zk, 5, 10, 'W0', 5),
      ac(zk, meterOsd, 5, 10),
      ac(meterOsd, pwp, 5, 10),
      ac(pwp, q1, 5, 10),
      ac(q1, f1, 5, 6, 'W1', 5),
      ac(f1, rcd, 5, 6),
      ac(q1, meterPv, 5, 6, 'W-PV', 8),
      ac(meterPv, fpv, 5, 6),
      ac(fpv, invH, 5, 6),
      makeCable(invH, bat, { cableType: 'YDY', cores: 2, crossSection: 25, current: 'DC' }, 'out', 'in'),
      dc(invH, qsdc, 0.5),
      dc(qsdc, fgpv1, 0.5),
      dc(qsdc, fgpv2, 0.5),
      dc(fgpv1, pv1, 12),
      dc(fgpv2, pv2, 12),
    ];

    return { nodes, edges };
  },
};
