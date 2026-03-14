import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { getSheetDimensions } from './sheetDimensions.ts';
import type { SheetFormat } from '../types/index.ts';

export async function exportToPdf(format: SheetFormat, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  const sheet = getSheetDimensions(format);

  const dataUrl = await toJpeg(el, {
    quality: 0.95,
    backgroundColor: '#ffffff',
    width: el.offsetWidth * 2,
    height: el.offsetHeight * 2,
    style: { transform: 'scale(2)', transformOrigin: 'top left' },
    filter: (node) => {
      if (node instanceof HTMLElement) {
        const cls = node.className?.toString() || '';
        if (cls.includes('react-flow__minimap') || cls.includes('react-flow__controls') || cls.includes('react-flow__panel')) {
          return false;
        }
      }
      return true;
    },
  });

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [sheet.widthMm, sheet.heightMm],
  });

  doc.addImage(dataUrl, 'JPEG', 0, 0, sheet.widthMm, sheet.heightMm);
  doc.save(`${projectName || 'schemat'}.pdf`);
}
