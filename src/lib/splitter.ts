export interface SplitFile {
  name: string;
  content: string;
  count: number;
}

export function buildFiles(numbers: string[], chunkSize: number): SplitFile[] {
  const chunks: string[][] = [];
  for (let i = 0; i < numbers.length; i += chunkSize) {
    chunks.push(numbers.slice(i, i + chunkSize));
  }
  const sizeCounts = new Map<number, number>();
  return chunks.map((chunk) => {
    const size = chunk.length;
    const seen = (sizeCounts.get(size) ?? 0) + 1;
    sizeCounts.set(size, seen);
    const name = seen === 1 ? `${size}.txt` : `${size} ${seen}.txt`;
    return { name, content: chunk.join("\n"), count: size };
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
