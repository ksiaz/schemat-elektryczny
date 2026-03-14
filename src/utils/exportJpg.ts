import { toJpeg } from 'html-to-image';

function shouldExclude(node: Element): boolean {
  const cls = node.getAttribute?.('class') || '';
  return cls.includes('react-flow__minimap') ||
    cls.includes('react-flow__controls') ||
    cls.includes('react-flow__panel') ||
    cls.includes('react-flow__background');
}

export async function exportToJpg(_format: string, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  const dataUrl = await toJpeg(el, {
    quality: 0.95,
    backgroundColor: '#ffffff',
    width: el.offsetWidth * 4,
    height: el.offsetHeight * 4,
    style: { transform: 'scale(4)', transformOrigin: 'top left' },
    filter: (node) => !shouldExclude(node as Element),
  });

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${projectName || 'schemat'}.jpg`;
  a.click();
}
