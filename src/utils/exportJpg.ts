import { toJpeg } from 'html-to-image';

export async function exportToJpg(_format: string, projectName: string) {
  const el = document.querySelector('.react-flow') as HTMLElement | null;
  if (!el) return;

  const dataUrl = await toJpeg(el, {
    quality: 0.95,
    backgroundColor: '#ffffff',
    width: el.offsetWidth * 2,
    height: el.offsetHeight * 2,
    style: { transform: 'scale(2)', transformOrigin: 'top left' },
  });

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${projectName || 'schemat'}.jpg`;
  a.click();
}
