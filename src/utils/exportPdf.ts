import jsPDF from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { getSheetDimensions } from './sheetDimensions.ts';
import type { SheetFormat } from '../types/index.ts';

// Eksportuje element SVG do PDF
export async function exportToPdf(
  svgElement: SVGSVGElement,
  format: SheetFormat,
  filename: string,
) {
  const sheet = getSheetDimensions(format);

  // A4/A3/A2 poziomy
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [sheet.widthMm, sheet.heightMm],
  });

  await svg2pdf(svgElement, doc, {
    x: 0,
    y: 0,
    width: sheet.widthMm,
    height: sheet.heightMm,
  });

  doc.save(`${filename}.pdf`);
}

// Pobiera SVG canvasu React Flow
export function getCanvasSvg(): SVGSVGElement | null {
  // React Flow renderuje w .react-flow__viewport
  const viewport = document.querySelector('.react-flow__viewport');
  if (!viewport) return null;

  // Klonujemy viewport do nowego SVG
  const reactFlowContainer = document.querySelector('.react-flow');
  if (!reactFlowContainer) return null;

  const svg = reactFlowContainer.querySelector('svg.react-flow__edges');
  if (!svg) return null;

  return svg as SVGSVGElement;
}
