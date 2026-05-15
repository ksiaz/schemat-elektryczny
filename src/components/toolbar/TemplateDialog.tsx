import { TEMPLATES } from '../../templates/index.ts';
import { SLD_TEMPLATES } from '../../templates/sld/index.ts';
import { useProjectStore } from '../../store/projectStore.ts';

interface TemplateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateDialog({ open, onClose }: TemplateDialogProps) {
  const activeSheet = useProjectStore((s) => s.activeSheet);
  const isSld = activeSheet === 'singleLine';

  if (!open) return null;
  const templates = isSld ? SLD_TEMPLATES : TEMPLATES;

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const { nodes, edges } = template.generate();
    const store = useProjectStore.getState();
    if (isSld) {
      store.pushSingleLineHistory();
      store.setSingleLineNodes(nodes);
      store.setSingleLineEdges(edges);
    } else {
      store.pushHistory();
      store.setNodes(nodes);
      store.setEdges(edges);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {isSld ? 'Szablony jednokreskowe' : 'Wybierz szablon'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Szablon zastąpi aktualny arkusz. Użyj Ctrl+Z aby cofnąć.
        </p>

        <div className="space-y-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl.id)}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-800">{tpl.name}</div>
              <div className="text-xs text-gray-500 mt-1">{tpl.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
