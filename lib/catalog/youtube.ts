/** YouTube helpers. All embeds use youtube-nocookie.com (allowed by the CSP in vercel.json). */

const YT_ID = /^[A-Za-z0-9_-]{11}$/
const PLAYLIST_ID = /^[A-Za-z0-9_-]{10,64}$/

export function isYouTubeId(id: string | null | undefined): id is string {
  return !!id && YT_ID.test(id)
}

export function embedUrl(videoId: string, opts: { start?: number; jsApi?: boolean } = {}) {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' })
  if (opts.start && opts.start > 0) params.set('start', String(Math.floor(opts.start)))
  if (opts.jsApi) params.set('enablejsapi', '1')
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`
}

export function playlistEmbedUrl(playlistId: string) {
  if (!PLAYLIST_ID.test(playlistId)) return null
  return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0`
}

export function watchUrl(videoId: string, start?: number) {
  const t = start && start > 0 ? `&t=${Math.floor(start)}s` : ''
  return `https://www.youtube.com/watch?v=${videoId}${t}`
}

/** maxresdefault isn't generated for every video; hqdefault always is. */
export function thumbnailUrl(videoId: string, quality: 'maxres' | 'hq' = 'hq') {
  return `https://i.ytimg.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`
}

export function lessonImage(lesson: { thumbnail_url: string | null; video_ref: string | null }) {
  if (lesson.thumbnail_url) return lesson.thumbnail_url
  if (isYouTubeId(lesson.video_ref)) return thumbnailUrl(lesson.video_ref)
  return null
}

/** 1805 → "30:05", 3725 → "1:02:05" */
export function formatTimestamp(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

/** 706 → "12 min", 5400 → "1 h 30 min" */
export function formatDuration(totalSeconds: number | null | undefined) {
  if (!totalSeconds || totalSeconds <= 0) return null
  const mins = Math.round(totalSeconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
