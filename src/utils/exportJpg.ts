import { toJpeg } from 'html-to-image';

export async function exportToJpg(_format: string, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  // Ukryj minimap, controls i waypoint overlay przed eksportem
  const minimap = el.querySelector('.react-flow__minimap') as HTMLElement | null;
  const controls = el.querySelector('.react-flow__controls') as HTMLElement | null;
  const panel = el.querySelector('.react-flow__panel') as HTMLElement | null;

  if (minimap) minimap.style.display = 'none';
  if (controls) controls.style.display = 'none';
  if (panel) panel.style.display = 'none';

  try {
    const dataUrl = await toJpeg(el, {
      quality: 0.95,
      backgroundColor: '#ffffff',
      width: el.offsetWidth * 4,
      height: el.offsetHeight * 4,
      style: { transform: 'scale(4)', transformOrigin: 'top left' },
      filter: (node) => {
        // Ukryj minimap, controls, panel
        if (node instanceof HTMLElement) {
          const cls = node.className?.toString() || '';
          if (cls.includes('react-flow__minimap') || cls.includes('react-flow__controls') || cls.includes('react-flow__panel') || cls.includes('react-flow__background')) {
            return false;
          }
        }
        return true;
      },
    });

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${projectName || 'schemat'}.jpg`;
    a.click();
  } finally {
    // Przywroc widocznosc
    if (minimap) minimap.style.display = '';
    if (controls) controls.style.display = '';
    if (panel) panel.style.display = '';
  }
}
