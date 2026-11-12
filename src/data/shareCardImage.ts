import { Directory, File, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';

let sharing = false;

export async function shareCardImage(url: string) {
  if (sharing) return;
  sharing = true;
  let exportFile: File | undefined;
  try {
    if (!(await Sharing.isAvailableAsync()))
      throw new Error('Sharing is unavailable');
    const directory = new Directory(Paths.cache, 'card-shares');
    directory.create({ idempotent: true });
    // This directory contains only our temporary exports, including interrupted shares.
    for (const file of directory.list()) file.delete();
    exportFile = new File(directory, 'card.png');
    const cachedPath = await Image.getCachePathAsync(url);
    const cachedFile = cachedPath
      ? new File(
          cachedPath.startsWith('/') ? `file://${cachedPath}` : cachedPath,
        )
      : undefined;
    if (cachedFile?.exists) {
      await cachedFile.copy(exportFile);
    } else {
      await File.downloadFileAsync(url, exportFile, { idempotent: true });
    }
    await Sharing.shareAsync(exportFile.uri, {
      mimeType: 'image/png',
      UTI: 'public.png',
    });
  } finally {
    try {
      if (exportFile?.exists) exportFile.delete();
    } finally {
      sharing = false;
    }
  }
}
