import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { getSheetDimensions } from './sheetDimensions.ts';
import type { SheetFormat } from '../types/index.ts';

function shouldExclude(node: Element): boolean {
  const cls = node.getAttribute?.('class') || '';
  return cls.includes('react-flow__minimap') ||
    cls.includes('react-flow__controls') ||
    cls.includes('react-flow__panel') ||
    cls.includes('react-flow__background');
}

export async function exportToPdf(format: SheetFormat, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  const sheet = getSheetDimensions(format);

  const dataUrl = await toJpeg(el, {
    quality: 0.95,
    backgroundColor: '#ffffff',
    width: el.offsetWidth * 4,
    height: el.offsetHeight * 4,
    style: { transform: 'scale(4)', transformOrigin: 'top left' },
    filter: (node) => !shouldExclude(node as Element),
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [sheet.widthMm, sheet.heightMm],
  });

  doc.addImage(dataUrl, 'JPEG', 0, 0, sheet.widthMm, sheet.heightMm);
  doc.save(`${projectName || 'schemat'}.pdf`);
}
