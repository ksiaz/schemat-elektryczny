import type { SheetFormat } from '../types/index.ts';

const SHEET_MM: Record<SheetFormat, { width: number; height: number }> = {
  A4: { width: 297, height: 210 },
  A3: { width: 420, height: 297 },
  A2: { width: 594, height: 420 },
};

const MARGIN_MM = 10;
const MM_TO_PX = 3.78;

export function getSheetDimensions(format: SheetFormat) {
  const sheet = SHEET_MM[format];
  return {
    widthPx: Math.round(sheet.width * MM_TO_PX),
    heightPx: Math.round(sheet.height * MM_TO_PX),
    workAreaX: Math.round(MARGIN_MM * MM_TO_PX),
    workAreaY: Math.round(MARGIN_MM * MM_TO_PX),
    workAreaWidth: Math.round((sheet.width - 2 * MARGIN_MM) * MM_TO_PX),
    workAreaHeight: Math.round((sheet.height - 2 * MARGIN_MM) * MM_TO_PX),
    widthMm: sheet.width,
    heightMm: sheet.height,
    marginMm: MARGIN_MM,
  };
}
