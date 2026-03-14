import { TEMPLATES } from '../../templates/index.ts';
import { useProjectStore } from '../../store/projectStore.ts';

interface TemplateDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TemplateDialog({ open, onClose }: TemplateDialogProps) {
  if (!open) return null;

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const { nodes, edges } = template.generate();
    const store = useProjectStore.getState();
    store.pushHistory();
    store.setNodes(nodes);
    store.setEdges(edges);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#252540] rounded-lg shadow-xl p-6 w-[480px] max-h-[80vh] overflow-y-auto border border-[#3a3a5c]">
        <h2 className="text-lg font-bold text-gray-200 mb-4">Wybierz szablon</h2>
        <p className="text-sm text-gray-400 mb-4">
          Szablon zastąpi aktualny schemat. Użyj Ctrl+Z aby cofnąć.
        </p>

        <div className="space-y-3">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl.id)}
              className="w-full text-left p-3 border border-[#3a3a5c] rounded-lg hover:border-blue-400 hover:bg-[#3a3a5c] transition-colors"
            >
              <div className="font-medium text-gray-200">{tpl.name}</div>
              <div className="text-xs text-gray-400 mt-1">{tpl.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:bg-[#3a3a5c] rounded"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
