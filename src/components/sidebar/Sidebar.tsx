import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import { LAYOUT_ELEMENT_DEFINITIONS } from '../../constants/layoutElements.ts';
import { SINGLE_LINE_ELEMENT_DEFINITIONS } from '../../constants/singleLineElements.ts';
import { useProjectStore } from '../../store/projectStore.ts';
import type { ElementCategory, ElementDefinition } from '../../types/index.ts';

const CATEGORY_NAMES: Record<ElementCategory, string> = {
  dc: 'Strona DC',
  ac: 'Strona AC',
  inverter: 'Falownik / magazyn',
  ev: 'Ładowarki EV',
  transfer: 'Przełączniki',
  grounding: 'Uziemienie',
  enclosure: 'Rozdzielnice',
  wiring: 'Linie i szyny',
  sldAcSource: 'AC — źródło / pomiar (SLD)',
  sldAcProtection: 'AC — aparaty / zabezpieczenia (SLD)',
  sldDc: 'Strona DC (SLD)',
  sldInverter: 'Falownik / magazyn (SLD)',
  sldGrounding: 'Uziemienie + granica (SLD)',
  sldEnclosure: 'Rozdzielnice (SLD)',
};

function groupByCategory(elements: ElementDefinition[]) {
  return elements.reduce<Record<string, ElementDefinition[]>>((groups, el) => {
    const cat = el.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(el);
    return groups;
  }, {});
}

export function Sidebar() {
  const activeSheet = useProjectStore((s) => s.activeSheet);

  const elements =
    activeSheet === 'layout' ? LAYOUT_ELEMENT_DEFINITIONS
    : activeSheet === 'singleLine' ? SINGLE_LINE_ELEMENT_DEFINITIONS
    : ELEMENT_DEFINITIONS;

  const dataType =
    activeSheet === 'layout' ? 'application/layout-element'
    : activeSheet === 'singleLine' ? 'application/sld-element'
    : 'application/schematic-element';

  const headerTitle =
    activeSheet === 'layout' ? 'Elementy lokalizacji'
    : activeSheet === 'singleLine' ? 'Elementy jednokreskowe'
    : 'Elementy schematu';

  const groupedElements = groupByCategory(elements);

  const onDragStart = (event: React.DragEvent, elementId: string) => {
    event.dataTransfer.setData(dataType, elementId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto p-3">
      <h2 className="text-sm font-bold text-gray-800 mb-3">
        {headerTitle}
      </h2>

      {Object.entries(groupedElements).map(([category, elems]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {CATEGORY_NAMES[category as ElementCategory] ?? category}
          </h3>
          <div className="space-y-1">
            {elems.map((el) => (
              <div
                key={el.id}
                draggable
                onDragStart={(e) => onDragStart(e, el.id)}
                className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 border border-gray-200 rounded cursor-grab hover:border-blue-400 hover:bg-gray-200 transition-colors text-sm"
              >
                <span className="text-gray-500 font-mono text-xs w-8">
                  {el.designation || '—'}
                </span>
                <span className="text-gray-600">{el.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
