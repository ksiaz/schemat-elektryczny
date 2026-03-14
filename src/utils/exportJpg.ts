import { toJpeg } from 'html-to-image';

export async function exportToJpg(_format: string, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

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

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${projectName || 'schemat'}.jpg`;
    a.click();
  } finally {
    hidden.forEach(node => { node.style.display = ''; });
  }
}
