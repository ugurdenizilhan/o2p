# o2p — AI Destekli Video Editör

Sohbet ile çalışan, masaüstü tabanlı kişisel video editör. 40+ dakikalık
ham çekimleri yükle, Türkçe komut ver, AI senin yerine kessin / birleştirsin
/ kısa video çıkarsın.

> **Durum:** Faz 1 iskelet sürümü. UI, IPC ve servis çerçeveleri hazır,
> Whisper ve FFmpeg render entegrasyonları sıradaki adımlarda doluyor.

## Hedef

- 20+ ham klibi tek pencerede yönet
- Doğal dil komutu: *"motor3'ten 'arkadaşlar bugün' ile 'gaza basıyorum' arasını al, sonuna reklam2'yi ekle"*
- Whisper ile lokal transkript (Türkçe)
- Claude API ile komut → EDL (kesim listesi) çevirimi
- FFmpeg ile donanım hızlandırmalı 1080p / 2K render
- Mac (Apple Silicon) ve Windows için tek kod

## Mimari Bakış

```
┌──────────────────── Electron Renderer (React) ───────────────────┐
│ MediaLibrary  Preview  Timeline  ChatPanel  SettingsDialog       │
│       └────────── Zustand Store ──────────┘                      │
└────────────────│ window.api (IPC) ────────────────────────────────┘
                 ▼
┌──────────────────── Electron Main (Node) ────────────────────────┐
│  ipc/      videos.* · ai.chat · settings.*                       │
│  services/ ffmpeg.ts · whisper.ts · claude.ts                    │
└───────────────────────────────────────────────────────────────────┘
```

## Geliştirme

```bash
npm install
npm run dev          # Electron + Vite hot reload
npm run typecheck    # main + renderer tip kontrolü
npm run build        # üretim derlemesi
npm run dist:mac     # .dmg üret (Apple Silicon + Intel)
npm run dist:win     # .exe üret (Windows x64)
```

İlk açılışta **Ayarlar → Claude API anahtarı** alanına `sk-ant-...` ile başlayan
anahtarı yapıştır. Anahtarı console.anthropic.com üzerinden alabilirsin.

## Donanım Notları

- **Mac (Apple Silicon)**: VideoToolbox HW encoder otomatik kullanılır → 40 dk 1080p ~3-5 dk.
- **Mac (Intel)**: VideoToolbox yine çalışır ama daha yavaş.
- **Windows + NVIDIA GPU**: Faz 1 sonrası NVENC entegrasyonu eklenecek.
- **Windows + onboard GPU**: libx264 fallback ile çalışır (daha yavaş).

## Faz Yol Haritası

- **Faz 1** (mevcut): Çekirdek iskelet, video içe aktarma, chat → EDL, 1080p/2K render
- **Faz 2**: Otomatik Shorts/Reels üretimi (highlight tespiti + 9:16 dikey kırpma)
- **Faz 3**: Altyazı yakma, başlık şablonları, geçiş efektleri
- **Faz 4**: Renk presetleri, marka şablonları (intro/outro)

## Klasör Yapısı

```
src/
  main/          Electron ana proses (Node)
    services/    FFmpeg, Whisper, Claude servisleri
    ipc/         Renderer ↔ Main köprüleri
  preload/       Güvenli contextBridge API
  renderer/      React UI
    components/  Panel bileşenleri
    store/       Zustand uygulama state'i
    lib/         Yardımcılar
  shared/        Main + Renderer paylaşılan tipler
```
