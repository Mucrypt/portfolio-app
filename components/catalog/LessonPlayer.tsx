'use client'

import { useRef } from 'react'
import { embedUrl, formatTimestamp, watchUrl } from '@/lib/catalog/youtube'
import type { Chapter } from '@/lib/catalog/types'

const YT_ORIGIN = 'https://www.youtube-nocookie.com'

/**
 * YouTube player with clickable chapters.
 * Seeking uses the iframe postMessage API (enablejsapi=1), so no YouTube
 * script is loaded on the page. Each chapter is also a real link to the
 * timestamp on YouTube, so it still works without JavaScript.
 */
export default function LessonPlayer({
  videoId,
  title,
  chapters,
}: {
  videoId: string
  title: string
  chapters: Chapter[]
}) {
  const frame = useRef<HTMLIFrameElement>(null)

  function seek(e: React.MouseEvent, seconds: number) {
    const win = frame.current?.contentWindow
    if (!win) return // fall through to the YouTube link
    e.preventDefault()
    const send = (func: string, args: unknown[] = []) =>
      win.postMessage(JSON.stringify({ event: 'command', func, args }), YT_ORIGIN)
    send('seekTo', [seconds, true])
    send('playVideo')
    frame.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div>
      <div className='relative w-full overflow-hidden rounded-xl bg-black shadow-xl aspect-video'>
        <iframe
          ref={frame}
          src={embedUrl(videoId, { jsApi: true })}
          title={title}
          className='absolute inset-0 h-full w-full'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        />
      </div>

      {chapters.length > 0 && (
        <details className='mt-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800' open>
          <summary className='cursor-pointer select-none px-5 py-4 font-semibold text-gray-900 dark:text-white'>
            Chapters ({chapters.length})
          </summary>
          <ol className='max-h-96 overflow-y-auto border-t border-gray-200 dark:border-gray-700'>
            {chapters.map((c) => (
              <li key={`${c.start}-${c.title}`}>
                <a
                  href={watchUrl(videoId, c.start)}
                  onClick={(e) => seek(e, c.start)}
                  className='flex gap-4 px-5 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50'
                >
                  <span className='w-16 shrink-0 font-mono text-blue-600 dark:text-blue-400'>
                    {formatTimestamp(c.start)}
                  </span>
                  <span className='text-gray-700 dark:text-gray-300'>{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}
