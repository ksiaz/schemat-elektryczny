import { ELEMENT_DEFINITIONS } from '../../constants/index.ts';
import type { ElementCategory } from '../../types/index.ts';

const CATEGORY_NAMES: Record<ElementCategory, string> = {
  dc: 'Strona DC',
  ac: 'Strona AC',
  inverter: 'Falownik / magazyn',
  ev: 'Ładowarki EV',
  transfer: 'Przełączniki',
  grounding: 'Uziemienie',
  enclosure: 'Rozdzielnice',
  wiring: 'Linie i szyny',
};

const groupedElements = ELEMENT_DEFINITIONS.reduce<Record<string, typeof ELEMENT_DEFINITIONS>>((groups, el) => {
  const cat = el.category;
  if (!groups[cat]) groups[cat] = [];
  groups[cat].push(el);
  return groups;
}, {});

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, elementId: string) => {
    event.dataTransfer.setData('application/schematic-element', elementId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 overflow-y-auto p-3">
      <h2 className="text-sm font-bold text-gray-700 mb-3">Elementy</h2>

      {Object.entries(groupedElements).map(([category, elements]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {CATEGORY_NAMES[category as ElementCategory] ?? category}
          </h3>
          <div className="space-y-1">
            {elements.map((el) => (
              <div
                key={el.id}
                draggable
                onDragStart={(e) => onDragStart(e, el.id)}
                className="flex items-center gap-2 px-2 py-1.5 bg-white border border-gray-200 rounded cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm"
              >
                <span className="text-gray-400 font-mono text-xs w-8">
                  {el.designation || '—'}
                </span>
                <span className="text-gray-700">{el.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
