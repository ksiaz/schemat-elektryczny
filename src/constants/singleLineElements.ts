import type { ElementDefinition } from '../types/index.ts';

export const SINGLE_LINE_ELEMENT_DEFINITIONS: ElementDefinition[] = [
  // ===== Źródło + pomiar AC =====
  {
    id: 'sld_grid_source',
    name: 'Źródło sieciowe',
    category: 'sldAcSource',
    designation: '',
    nodeType: 'sldGridSource',
    defaultLabel: 'Sieć',
    parameters: [
      { key: 'network', label: 'Sieć', type: 'text', defaultValue: '~3/N/PE 400/230 V 50 Hz' },
    ],
  },
  {
    id: 'sld_cable_junction',
    name: 'Złącze kablowe',
    category: 'sldAcSource',
    designation: 'ZK',
    nodeType: 'sldCableJunction',
    defaultLabel: 'ZK',
    parameters: [],
  },
  {
    id: 'sld_meter',
    name: 'Licznik energii',
    category: 'sldAcSource',
    designation: 'P',
    nodeType: 'sldMeter',
    defaultLabel: 'P1',
    parameters: [
      { key: 'direction', label: 'Kierunek', type: 'select', options: ['1-kier', '2-kier'], defaultValue: '2-kier' },
      { key: 'phases', label: 'Fazy', type: 'select', options: ['1', '3'], defaultValue: '3' },
    ],
  },
  {
    id: 'sld_ct',
    name: 'Przekładnik prądowy',
    category: 'sldAcSource',
    designation: 'TA',
    nodeType: 'sldCt',
    defaultLabel: 'TA1',
    parameters: [
      { key: 'ratio', label: 'Przekładnia', type: 'text', defaultValue: '100/5A' },
    ],
  },

  // ===== Aparaty łączeniowe + zabezpieczenia AC =====
  {
    id: 'sld_main_switch',
    name: 'Rozłącznik główny',
    category: 'sldAcProtection',
    designation: 'Q',
    nodeType: 'sldMainSwitch',
    defaultLabel: 'Q1',
    parameters: [
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'], defaultValue: '4P' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 63 },
    ],
  },
  {
    id: 'sld_fire_switch',
    name: 'PWP (wyłącznik pożarowy)',
    category: 'sldAcProtection',
    designation: 'F-PWP',
    nodeType: 'sldFireSwitch',
    defaultLabel: 'PWP',
    parameters: [],
  },
  {
    id: 'sld_mcb',
    name: 'Wyłącznik MCB',
    category: 'sldAcProtection',
    designation: 'F',
    nodeType: 'sldMcb',
    defaultLabel: 'F1',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'], defaultValue: 'B' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'], defaultValue: '1P' },
    ],
  },
  {
    id: 'sld_rcd',
    name: 'Wyłącznik RCD',
    category: 'sldAcProtection',
    designation: 'F-RCD',
    nodeType: 'sldRcd',
    defaultLabel: 'F-RCD1',
    parameters: [
      { key: 'rcdType', label: 'Typ', type: 'select', options: ['A', 'B', 'F', 'B+'], defaultValue: 'A' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'], defaultValue: '4P' },
    ],
  },
  {
    id: 'sld_rcbo',
    name: 'Wyłącznik RCBO (MCB+RCD)',
    category: 'sldAcProtection',
    designation: 'F',
    nodeType: 'sldRcbo',
    defaultLabel: 'F1',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'], defaultValue: 'B' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'rcdType', label: 'Typ RCD', type: 'select', options: ['A', 'B', 'F', 'B+'], defaultValue: 'A' },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P+N', '3P+N'], defaultValue: '1P+N' },
    ],
  },
  {
    id: 'sld_spd_ac',
    name: 'Ogranicznik przepięć AC',
    category: 'sldAcProtection',
    designation: 'F-SPD',
    nodeType: 'sldSpdAc',
    defaultLabel: 'F-SPD1',
    parameters: [
      { key: 'spdClass', label: 'Klasa', type: 'select', options: ['T1', 'T1+2', 'T2', 'T3'], defaultValue: 'T2' },
      { key: 'uc', label: 'UC', type: 'number', unit: 'V', defaultValue: 275 },
    ],
  },

  // ===== Strona DC =====
  {
    id: 'sld_pv_string',
    name: 'String PV',
    category: 'sldDc',
    designation: 'E',
    nodeType: 'sldPvString',
    defaultLabel: 'PV1',
    parameters: [
      { key: 'panelCount', label: 'Liczba paneli', type: 'number', defaultValue: 8 },
      { key: 'voc', label: 'Voc', type: 'number', unit: 'V' },
      { key: 'isc', label: 'Isc', type: 'number', unit: 'A' },
      { key: 'mpp', label: 'Pmpp', type: 'number', unit: 'W' },
    ],
  },
  {
    id: 'sld_dc_disconnect',
    name: 'Rozłącznik DC',
    category: 'sldDc',
    designation: 'QS',
    nodeType: 'sldDcDisconnect',
    defaultLabel: 'QS1',
    parameters: [
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'], defaultValue: '2P' },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'ratingVoltage', label: 'Un', type: 'number', unit: 'V', defaultValue: 1000 },
    ],
  },
  {
    id: 'sld_fuse_gpv',
    name: 'Bezpiecznik gPV',
    category: 'sldDc',
    designation: 'F',
    nodeType: 'sldFuseGpv',
    defaultLabel: 'F1',
    parameters: [
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 15 },
      { key: 'ratingVoltage', label: 'Un', type: 'number', unit: 'V', defaultValue: 1000 },
    ],
  },
  {
    id: 'sld_spd_dc',
    name: 'Ogranicznik przepięć DC',
    category: 'sldDc',
    designation: 'F-SPD',
    nodeType: 'sldSpdDc',
    defaultLabel: 'F-SPD1',
    parameters: [
      { key: 'spdClass', label: 'Klasa', type: 'select', options: ['T1+2', 'T2'], defaultValue: 'T1+2' },
      { key: 'uc', label: 'UC', type: 'number', unit: 'V', defaultValue: 600 },
    ],
  },

  // ===== Falownik + magazyn =====
  {
    id: 'sld_inverter',
    name: 'Falownik DC/AC',
    category: 'sldInverter',
    designation: 'U',
    nodeType: 'sldInverter',
    defaultLabel: 'U1',
    parameters: [
      { key: 'type', label: 'Typ', type: 'select', options: ['string', 'hybrid', 'mikro'], defaultValue: 'string' },
      { key: 'power', label: 'Moc', type: 'number', unit: 'kW', defaultValue: 10 },
      { key: 'mppt', label: 'MPPT', type: 'number', defaultValue: 2 },
    ],
  },
  {
    id: 'sld_battery',
    name: 'Magazyn energii',
    category: 'sldInverter',
    designation: 'G',
    nodeType: 'sldBattery',
    defaultLabel: 'BAT',
    parameters: [
      { key: 'chemistry', label: 'Chemia', type: 'select', options: ['LiFePO4', 'NMC', 'LTO'], defaultValue: 'LiFePO4' },
      { key: 'capacity', label: 'Pojemność', type: 'number', unit: 'kWh', defaultValue: 10 },
      { key: 'voltage', label: 'Napięcie', type: 'number', unit: 'V', defaultValue: 48 },
    ],
  },

  // ===== Uziemienie + granica =====
  {
    id: 'sld_ground',
    name: 'Uziom',
    category: 'sldGrounding',
    designation: '',
    nodeType: 'sldGround',
    defaultLabel: '',
    parameters: [
      { key: 're', label: 'RE', type: 'number', unit: 'Ω', defaultValue: 10 },
    ],
  },
  {
    id: 'sld_osd_boundary',
    name: 'Granica własności OSD',
    category: 'sldGrounding',
    designation: '',
    nodeType: 'sldOsdBoundary',
    defaultLabel: '',
    parameters: [
      { key: 'label', label: 'Etykieta', type: 'text', defaultValue: 'Granica własności OSD' },
    ],
  },
];
