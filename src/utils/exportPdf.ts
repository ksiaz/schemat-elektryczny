import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import { getSheetDimensions } from './sheetDimensions.ts';
import type { SheetFormat } from '../types/index.ts';

export async function exportToPdf(format: SheetFormat, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  const sheet = getSheetDimensions(format);

  // Ukryj siatke, minimap, controls
  const hideSelectors = ['.react-flow__background', '.react-flow__minimap', '.react-flow__controls'];
  const hidden: HTMLElement[] = [];
  hideSelectors.forEach(sel => {
    el.querySelectorAll(sel).forEach(node => {
      const htmlNode = node as HTMLElement;
      hidden.push(htmlNode);
      htmlNode.style.display = 'none';
    });
  });

  try {
    const dataUrl = await toJpeg(el, {
      quality: 0.95,
      backgroundColor: '#ffffff',
      width: el.offsetWidth * 4,
      height: el.offsetHeight * 4,
      style: { transform: 'scale(4)', transformOrigin: 'top left' },
    });

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [sheet.widthMm, sheet.heightMm],
    });

    doc.addImage(dataUrl, 'JPEG', 0, 0, sheet.widthMm, sheet.heightMm);
    doc.save(`${projectName || 'schemat'}.pdf`);
  } finally {
    hidden.forEach(node => { node.style.display = ''; });
  }
}
