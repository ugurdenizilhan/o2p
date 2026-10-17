import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage, Edl, VideoAsset } from '@shared/types'
import { settingsStore } from '../store'

// Claude'a "video editör asistanı" rolünü veren sistem prompt'u.
// Doğal dil komutlarını yapılandırılmış EDL'ye çevirmesi için ona videoları
// ve mevcut transkriptleri bağlam olarak veriyoruz.
function buildSystemPrompt(videos: VideoAsset[]): string {
  const lines: string[] = []
  lines.push('Sen bir video editör asistanısın. Kullanıcı sana Türkçe komut verir.')
  lines.push('Görevin: komutu yapılandırılmış bir EDL (Edit Decision List) JSON çıktısına çevirmek.')
  lines.push('')
  lines.push('Kullanıcının kütüphanesindeki videolar:')
  for (const v of videos) {
    lines.push(`- id="${v.id}" name="${v.fileName}" duration=${v.durationSec.toFixed(1)}s`)
    if (v.transcript && v.transcript.segments.length > 0) {
      lines.push('  transkript:')
      for (const s of v.transcript.segments) {
        lines.push(`    [${s.startSec.toFixed(1)}-${s.endSec.toFixed(1)}] ${s.text}`)
      }
    }
  }
  lines.push('')
  lines.push('Cevabını şu JSON formatında bir kod bloğu olarak ver:')
  lines.push('```json')
  lines.push('{ "explanation": "...", "edl": { "clips": [{ "sourceVideoId": "...", "inSec": 0, "outSec": 10 }] } }')
  lines.push('```')
  return lines.join('\n')
}

export interface ClaudeResponse {
  text: string
  proposedEdl?: Edl
}

export async function chat(
  history: ChatMessage[],
  videos: VideoAsset[]
): Promise<ClaudeResponse> {
  const apiKey = settingsStore.get('anthropicApiKey')
  if (!apiKey) {
    throw new Error('Claude API anahtarı ayarlanmamış. Ayarlar ekranından gir.')
  }

  const client = new Anthropic({ apiKey })

  const messages = history
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: buildSystemPrompt(videos),
    messages
  })

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  return { text, proposedEdl: extractEdl(text) }
}

function extractEdl(text: string): Edl | undefined {
  const match = text.match(/```json\s*([\s\S]*?)```/)
  if (!match) return undefined
  try {
    const parsed = JSON.parse(match[1])
    if (parsed?.edl?.clips) {
      return {
        outputWidth: 1920,
        outputHeight: 1080,
        fps: 30,
        clips: parsed.edl.clips.map((c: { sourceVideoId: string; inSec: number; outSec: number }, i: number) => ({
          id: `clip-${i}`,
          sourceVideoId: c.sourceVideoId,
          inSec: c.inSec,
          outSec: c.outSec
        }))
      }
    }
  } catch {
    // JSON parse hatası — Claude format dışı cevap verdi, sessizce yok say
  }
  return undefined
}
