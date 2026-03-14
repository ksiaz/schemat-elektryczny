import { getSheetDimensions } from './sheetDimensions.ts';
import type { SheetFormat } from '../types/index.ts';

export function exportToJpg(format: SheetFormat, projectName: string) {
  const sheet = getSheetDimensions(format);
  const reactFlowEl = document.querySelector('.react-flow__viewport') as SVGGElement | null;
  if (!reactFlowEl) return;

  // Klonuj viewport do canvas
  const svgNs = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNs, 'svg');
  svg.setAttribute('xmlns', svgNs);
  svg.setAttribute('width', String(sheet.widthPx * 2));
  svg.setAttribute('height', String(sheet.heightPx * 2));
  svg.setAttribute('viewBox', `0 0 ${sheet.widthPx} ${sheet.heightPx}`);
  svg.setAttribute('style', 'background: white');

  const clone = reactFlowEl.cloneNode(true) as SVGGElement;
  clone.removeAttribute('transform');
  svg.appendChild(clone);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = sheet.widthPx * 2;
    canvas.height = sheet.heightPx * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${projectName || 'schemat'}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/jpeg', 0.95);
  };
  img.src = url;
}
