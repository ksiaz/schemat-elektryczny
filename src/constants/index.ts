import type { ElementDefinition, WireType } from '../types/index.ts';

export const WIRE_COLORS: Record<WireType, string> = {
  L1: '#808080',
  L2: '#1a1a1a',
  L3: '#8B4513',
  N:  '#0000CD',
  PE: '#228B22',
  DC: '#FF0000',
};

export const ELEMENT_DEFINITIONS: ElementDefinition[] = [
  {
    id: 'inverter',
    name: 'Falownik DC/AC',
    category: 'inverter',
    designation: 'U',
    nodeType: 'inverter',
    defaultLabel: 'U1',
    parameters: [
      { key: 'model', label: 'Model', type: 'text' },
      { key: 'power', label: 'Moc', type: 'number', unit: 'kW' },
      { key: 'mppt', label: 'Liczba MPPT', type: 'number', defaultValue: 2 },
      { key: 'type', label: 'Typ', type: 'select', options: ['ON-grid', 'Hybryda', 'Off-grid'] },
    ],
  },
  {
    id: 'rcd',
    name: 'Wyłącznik RCD',
    category: 'ac',
    designation: 'F-RCD',
    nodeType: 'rcd',
    defaultLabel: 'F1',
    parameters: [
      { key: 'rcdType', label: 'Typ', type: 'select', options: ['A', 'B', 'F', 'B+'] },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 25 },
      { key: 'sensitivityCurrent', label: 'IΔn', type: 'number', unit: 'mA', defaultValue: 30 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['2P', '4P'] },
    ],
  },
  {
    id: 'mcb',
    name: 'Wyłącznik MCB',
    category: 'ac',
    designation: 'F',
    nodeType: 'mcb',
    defaultLabel: 'F2',
    parameters: [
      { key: 'curve', label: 'Krzywa', type: 'select', options: ['B', 'C', 'D'] },
      { key: 'ratingCurrent', label: 'In', type: 'number', unit: 'A', defaultValue: 16 },
      { key: 'poles', label: 'Bieguny', type: 'select', options: ['1P', '2P', '3P', '4P'] },
    ],
  },
  {
    id: 'ac_busbar',
    name: 'Szyna zbiorcza AC',
    category: 'wiring',
    designation: '',
    nodeType: 'acBusbar',
    defaultLabel: 'Szyna AC',
    parameters: [],
  },
  {
    id: 'ground_rod',
    name: 'Uziom',
    category: 'grounding',
    designation: '',
    nodeType: 'ground',
    defaultLabel: 'Uziom',
    parameters: [
      { key: 'resistance', label: 'RE', type: 'number', unit: 'Ω' },
      { key: 'groundType', label: 'Typ', type: 'select', options: ['pionowy', 'poziomy'] },
    ],
  },
  // --- Rozdzielnice (Etap 2) ---
  {
    id: 'main_enclosure',
    name: 'Rozdzielnica główna',
    category: 'enclosure',
    designation: 'RG',
    nodeType: 'enclosure',
    defaultLabel: 'RG',
    parameters: [
      { key: 'modules', label: 'Moduły', type: 'number', defaultValue: 24 },
      { key: 'ip', label: 'IP', type: 'select', options: ['IP20', 'IP30', 'IP44', 'IP55', 'IP65'] },
      { key: 'manufacturer', label: 'Producent', type: 'text' },
    ],
  },
  {
    id: 'sub_enclosure',
    name: 'Podrozdzielnica',
    category: 'enclosure',
    designation: 'RP',
    nodeType: 'enclosure',
    defaultLabel: 'RP',
    parameters: [
      { key: 'modules', label: 'Moduły', type: 'number', defaultValue: 12 },
      { key: 'ip', label: 'IP', type: 'select', options: ['IP20', 'IP30', 'IP44', 'IP55', 'IP65'] },
      { key: 'manufacturer', label: 'Producent', type: 'text' },
    ],
  },
  {
    id: 'pv_dc_enclosure',
    name: 'Rozdzielnica DC PV',
    category: 'enclosure',
    designation: 'RPV-DC',
    nodeType: 'enclosure',
    defaultLabel: 'RPV-DC',
    parameters: [
      { key: 'modules', label: 'Moduły', type: 'number', defaultValue: 6 },
      { key: 'ip', label: 'IP', type: 'select', options: ['IP20', 'IP30', 'IP44', 'IP55', 'IP65'] },
    ],
  },
  {
    id: 'pv_ac_enclosure',
    name: 'Rozdzielnica AC PV',
    category: 'enclosure',
    designation: 'RPV-AC',
    nodeType: 'enclosure',
    defaultLabel: 'RPV-AC',
    parameters: [
      { key: 'modules', label: 'Moduły', type: 'number', defaultValue: 12 },
      { key: 'ip', label: 'IP', type: 'select', options: ['IP20', 'IP30', 'IP44', 'IP55', 'IP65'] },
    ],
  },
];
