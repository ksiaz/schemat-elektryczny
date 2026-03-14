import type { ElementDefinition } from '../types/index.ts';

// Elementy modulu lokalizacji — osobna lista od schematow
export const LAYOUT_ELEMENT_DEFINITIONS: ElementDefinition[] = [
  {
    id: 'building_outline',
    name: 'Zarys budynku',
    category: 'enclosure',
    designation: '',
    nodeType: 'building',
    defaultLabel: 'Budynek',
    parameters: [
      { key: 'floors', label: 'Piętra', type: 'number', defaultValue: 1 },
    ],
  },
  {
    id: 'roof_outline',
    name: 'Zarys dachu',
    category: 'enclosure',
    designation: '',
    nodeType: 'roof',
    defaultLabel: 'Dach',
    parameters: [
      { key: 'roofType', label: 'Typ', type: 'select', options: ['dwuspadowy', 'płaski', 'jednospadowy'] },
    ],
  },
  {
    id: 'pv_panel_layout',
    name: 'Panele PV (widok z góry)',
    category: 'dc',
    designation: '',
    nodeType: 'pvPanelLayout',
    defaultLabel: 'PV',
    parameters: [
      { key: 'count', label: 'Liczba paneli', type: 'number', defaultValue: 10 },
      { key: 'model', label: 'Model', type: 'text' },
    ],
  },
  {
    id: 'device_icon_inverter',
    name: 'Falownik (ikona)',
    category: 'inverter',
    designation: '',
    nodeType: 'deviceIcon',
    defaultLabel: 'Falownik',
    parameters: [
      { key: 'deviceType', label: 'Typ ikony', type: 'select', options: ['inverter', 'enclosure', 'ground', 'charger'], defaultValue: 'inverter' },
    ],
  },
  {
    id: 'device_icon_enclosure',
    name: 'Rozdzielnica (ikona)',
    category: 'enclosure',
    designation: '',
    nodeType: 'deviceIcon',
    defaultLabel: 'Rozdzielnica',
    parameters: [
      { key: 'deviceType', label: 'Typ ikony', type: 'select', options: ['inverter', 'enclosure', 'ground', 'charger'], defaultValue: 'enclosure' },
    ],
  },
  {
    id: 'device_icon_ground',
    name: 'Uziom (ikona)',
    category: 'grounding',
    designation: '',
    nodeType: 'deviceIcon',
    defaultLabel: 'Uziom',
    parameters: [
      { key: 'deviceType', label: 'Typ ikony', type: 'select', options: ['inverter', 'enclosure', 'ground', 'charger'], defaultValue: 'ground' },
    ],
  },
  {
    id: 'device_icon_charger',
    name: 'Ładowarka EV (ikona)',
    category: 'ev',
    designation: '',
    nodeType: 'deviceIcon',
    defaultLabel: 'EV',
    parameters: [
      { key: 'deviceType', label: 'Typ ikony', type: 'select', options: ['inverter', 'enclosure', 'ground', 'charger'], defaultValue: 'charger' },
    ],
  },
  {
    id: 'cable_route',
    name: 'Punkt trasy kablowej',
    category: 'wiring',
    designation: '',
    nodeType: 'cableRoute',
    defaultLabel: '',
    parameters: [
      { key: 'routeColor', label: 'Kolor', type: 'select', options: ['#FF6600', '#FF0000', '#0000CD', '#228B22', '#1a1a1a', '#808080'], defaultValue: '#FF6600' },
      { key: 'description', label: 'Opis', type: 'text' },
    ],
  },
  {
    id: 'layout_line_h',
    name: 'Linia pozioma',
    category: 'wiring',
    designation: '',
    nodeType: 'layoutLine',
    defaultLabel: '',
    parameters: [
      { key: 'orientation', label: 'Orientacja', type: 'select', options: ['pozioma', 'pionowa'], defaultValue: 'pozioma' },
      { key: 'color', label: 'Kolor', type: 'select', options: ['#333', '#FF0000', '#0000CD', '#228B22', '#FF6600', '#808080'], defaultValue: '#333' },
      { key: 'lineWidth', label: 'Grubość', type: 'number', defaultValue: 2 },
    ],
  },
  {
    id: 'layout_line_v',
    name: 'Linia pionowa',
    category: 'wiring',
    designation: '',
    nodeType: 'layoutLine',
    defaultLabel: '',
    parameters: [
      { key: 'orientation', label: 'Orientacja', type: 'select', options: ['pozioma', 'pionowa'], defaultValue: 'pionowa' },
      { key: 'color', label: 'Kolor', type: 'select', options: ['#333', '#FF0000', '#0000CD', '#228B22', '#FF6600', '#808080'], defaultValue: '#333' },
      { key: 'lineWidth', label: 'Grubość', type: 'number', defaultValue: 2 },
    ],
  },
  {
    id: 'ruler_h',
    name: 'Miara pozioma',
    category: 'wiring',
    designation: '',
    nodeType: 'ruler',
    defaultLabel: '1m',
    parameters: [
      { key: 'orientation', label: 'Orientacja', type: 'select', options: ['pozioma', 'pionowa'], defaultValue: 'pozioma' },
    ],
  },
  {
    id: 'compass',
    name: 'Wskaźnik N-S',
    category: 'wiring',
    designation: '',
    nodeType: 'compass',
    defaultLabel: '',
    parameters: [
      { key: 'rotation', label: 'Obrót (°)', type: 'number', defaultValue: 0 },
    ],
  },
  {
    id: 'legend',
    name: 'Legenda',
    category: 'wiring',
    designation: '',
    nodeType: 'legend',
    defaultLabel: 'LEGENDA',
    parameters: [],
  },
  {
    id: 'ruler_v',
    name: 'Miara pionowa',
    category: 'wiring',
    designation: '',
    nodeType: 'ruler',
    defaultLabel: '1m',
    parameters: [
      { key: 'orientation', label: 'Orientacja', type: 'select', options: ['pozioma', 'pionowa'], defaultValue: 'pionowa' },
    ],
  },
];
