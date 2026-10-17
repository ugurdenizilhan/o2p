import ffmpegPath from 'ffmpeg-static'
import ffprobeStatic from 'ffprobe-static'
import { spawn } from 'child_process'

// electron-builder asarUnpack ile birlikte çalışsın diye paketlenmiş yoldan
// gerçek dosya yoluna çeviriyoruz.
const resolveBin = (p: string | null | undefined): string => {
  if (!p) throw new Error('FFmpeg/FFprobe binary not found')
  return p.replace('app.asar', 'app.asar.unpacked')
}

export const FFMPEG_BIN = resolveBin(ffmpegPath)
export const FFPROBE_BIN = resolveBin(ffprobeStatic.path)

export interface ProbeResult {
  durationSec: number
  width: number
  height: number
  fps: number
  sizeBytes: number
}

export async function probe(filePath: string): Promise<ProbeResult> {
  const args = [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate',
    '-show_entries', 'format=duration,size',
    '-of', 'json',
    filePath
  ]
  const out = await runCapture(FFPROBE_BIN, args)
  const data = JSON.parse(out)
  const stream = data.streams?.[0] ?? {}
  const format = data.format ?? {}

  const [num, den] = String(stream.r_frame_rate ?? '0/1').split('/').map(Number)
  const fps = den ? num / den : 0

  return {
    durationSec: parseFloat(format.duration ?? '0'),
    width: stream.width ?? 0,
    height: stream.height ?? 0,
    fps,
    sizeBytes: parseInt(format.size ?? '0', 10)
  }
}

function runCapture(bin: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args)
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (b) => (stdout += b.toString()))
    child.stderr.on('data', (b) => (stderr += b.toString()))
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve(stdout)
      else reject(new Error(`Exit ${code}: ${stderr}`))
    })
  })
}

// Apple Silicon'da VideoToolbox, NVIDIA'da NVENC kullanacak şekilde
// uygun donanım encoder'ını seçer. Yoksa libx264 fallback.
export function pickEncoder(): { codec: string; extraArgs: string[] } {
  if (process.platform === 'darwin') {
    return { codec: 'h264_videotoolbox', extraArgs: ['-b:v', '0', '-q:v', '60'] }
  }
  // Windows/Linux için NVENC denemesi ileride: -hwaccel cuda + h264_nvenc
  // Şimdilik güvenli yazılım encoder
  return { codec: 'libx264', extraArgs: ['-preset', 'medium', '-crf', '20'] }
}
