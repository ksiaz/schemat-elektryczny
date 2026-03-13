// Import/eksport projektu jako plik JSON

export function exportProjectToFile(projectData: string, projectName: string) {
  const blob = new Blob([projectData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName || 'projekt'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFromFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error('Nie wybrano pliku'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Blad odczytu pliku'));
      reader.readAsText(file);
    };
    input.click();
  });
}
