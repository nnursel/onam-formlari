export async function uploadToDrive(blob: Blob, filename: string): Promise<void> {
  const form = new FormData();
  form.append('file', blob, filename);

  const res = await fetch('/api/upload', { method: 'POST', body: form });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? `Yükleme hatası: ${res.status}`);
  }
}
