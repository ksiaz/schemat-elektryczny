import type { SheetFormat } from '../types/index.ts';
import { getSheetDimensions } from './sheetDimensions.ts';

// Eksportuje widok React Flow do pliku SVG
export function exportToSvg(format: SheetFormat, projectName: string) {
  const sheet = getSheetDimensions(format);

  const reactFlowEl = document.querySelector('.react-flow');
  if (!reactFlowEl) return;

  // Pobierz viewport React Flow
  const viewport = reactFlowEl.querySelector('.react-flow__viewport') as SVGGElement | null;
  if (!viewport) return;

  // Stworz nowy SVG z metadanymi
  const svgNs = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('xmlns', svgNs);
  svg.setAttribute('width', `${sheet.widthMm}mm`);
  svg.setAttribute('height', `${sheet.heightMm}mm`);
  svg.setAttribute('viewBox', `0 0 ${sheet.widthPx} ${sheet.heightPx}`);

  // Komentarz z metadanymi
  const comment = document.createComment(
    ` Projekt: ${projectName} | Format: ${format} | Data: ${new Date().toLocaleDateString('pl-PL')} `
  );
  svg.appendChild(comment);

  // Klonuj zawartosc viewport
  const clone = viewport.cloneNode(true) as SVGGElement;

  // Usun transformacje viewport (zoom/pan) — renderuj w pelnym rozmiarze
  clone.removeAttribute('transform');
  clone.setAttribute('transform', 'translate(0,0) scale(1)');

  svg.appendChild(clone);

  // Dodaj inline style z kolorami
  const style = document.createElementNS(svgNs, 'style');
  style.textContent = `
    text { font-family: system-ui, sans-serif; }
    .react-flow__edge-path { fill: none; }
  `;
  svg.prepend(style);

  // Pobierz jako plik
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName || 'schemat'}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
