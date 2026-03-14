import { useProjectStore } from '../../store/projectStore.ts';
import { getSheetDimensions } from '../../utils/sheetDimensions.ts';

const TABLE_WIDTH = 180;
const TABLE_HEIGHT = 56;
const ROW_HEIGHT = 14;

export function DrawingFrame() {
  const { projectInfo, schematicFormat } = useProjectStore();
  const sheet = getSheetDimensions(schematicFormat);

  const tableX = sheet.widthPx - sheet.workAreaX - TABLE_WIDTH;
  const tableY = sheet.heightPx - sheet.workAreaY - TABLE_HEIGHT;

  return (
    <svg
      width={sheet.widthPx}
      height={sheet.heightPx}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <rect x={0} y={0} width={sheet.widthPx} height={sheet.heightPx} fill="none" stroke="#333" strokeWidth="1" />
      <rect x={sheet.workAreaX} y={sheet.workAreaY} width={sheet.workAreaWidth} height={sheet.workAreaHeight} fill="none" stroke="#333" strokeWidth="0.5" />

      <g>
        <rect x={tableX} y={tableY} width={TABLE_WIDTH} height={TABLE_HEIGHT} fill="white" stroke="#333" strokeWidth="0.8" />

        {/* Wiersz 1: Nazwa projektu */}
        <line x1={tableX} y1={tableY + ROW_HEIGHT} x2={tableX + TABLE_WIDTH} y2={tableY + ROW_HEIGHT} stroke="#333" strokeWidth="0.5" />
        <text x={tableX + 3} y={tableY + 10} fontSize="6" fill="#999">Projekt:</text>
        <text x={tableX + 35} y={tableY + 10} fontSize="7" fill="#333" fontWeight="bold">
          {projectInfo.projectName || '—'}
        </text>

        {/* Wiersz 2: Adres | Data */}
        <line x1={tableX} y1={tableY + ROW_HEIGHT * 2} x2={tableX + TABLE_WIDTH} y2={tableY + ROW_HEIGHT * 2} stroke="#333" strokeWidth="0.5" />
        <text x={tableX + 3} y={tableY + ROW_HEIGHT + 10} fontSize="6" fill="#999">Adres:</text>
        <text x={tableX + 28} y={tableY + ROW_HEIGHT + 10} fontSize="7" fill="#333">
          {projectInfo.address || '—'}
        </text>
        <line x1={tableX + 120} y1={tableY + ROW_HEIGHT} x2={tableX + 120} y2={tableY + ROW_HEIGHT * 2} stroke="#333" strokeWidth="0.5" />
        <text x={tableX + 123} y={tableY + ROW_HEIGHT + 10} fontSize="6" fill="#999">Data:</text>
        <text x={tableX + 142} y={tableY + ROW_HEIGHT + 10} fontSize="7" fill="#333">
          {projectInfo.date}
        </text>

        {/* Wiersz 3: Projektant | Skala */}
        <line x1={tableX} y1={tableY + ROW_HEIGHT * 3} x2={tableX + TABLE_WIDTH} y2={tableY + ROW_HEIGHT * 3} stroke="#333" strokeWidth="0.5" />
        <text x={tableX + 3} y={tableY + ROW_HEIGHT * 2 + 10} fontSize="6" fill="#999">Proj.:</text>
        <text x={tableX + 25} y={tableY + ROW_HEIGHT * 2 + 10} fontSize="7" fill="#333">
          {projectInfo.designer || '—'}
        </text>
        <line x1={tableX + 120} y1={tableY + ROW_HEIGHT * 2} x2={tableX + 120} y2={tableY + ROW_HEIGHT * 3} stroke="#333" strokeWidth="0.5" />
        <text x={tableX + 123} y={tableY + ROW_HEIGHT * 2 + 10} fontSize="6" fill="#999">Skala:</text>
        <text x={tableX + 145} y={tableY + ROW_HEIGHT * 2 + 10} fontSize="7" fill="#333">
          {projectInfo.scale}
        </text>

        {/* Wiersz 4: Format */}
        <text x={tableX + 3} y={tableY + ROW_HEIGHT * 3 + 10} fontSize="6" fill="#999">Format:</text>
        <text x={tableX + 35} y={tableY + ROW_HEIGHT * 3 + 10} fontSize="8" fill="#333" fontWeight="bold">
          {schematicFormat}
        </text>
      </g>
    </svg>
  );
}
