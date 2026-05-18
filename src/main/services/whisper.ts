// Whisper transkripsiyon servisi - Faz 1'de stub.
//
// Üretim implementasyonu için plan:
//   - whisper.cpp binary'sini uygulamayla bundle et (Mac Metal + Windows CUDA destekli)
//   - Model dosyalarını ilk açılışta ~/.o2p/models/ altına indir
//   - ffmpeg ile videodan 16kHz mono wav çıkar, whisper.cpp'ye ver
//   - JSON çıktısını TranscriptSegment[] yapısına dönüştür
//
// Şimdilik IPC sözleşmesini kilitlemek için boş bir transkript döner.

import type { Transcript } from '@shared/types'

export async function transcribeFile(
  _filePath: string,
  _opts: { language: string; model: string }
): Promise<Transcript> {
  // TODO(faz1-step2): whisper.cpp entegrasyonu
  return {
    language: _opts.language,
    segments: []
  }
}
