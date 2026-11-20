'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { publishModuleLessons, setLessonPublished } from './actions'

export function PublishToggle({
  lessonId,
  published,
  hasVideo,
  title,
}: {
  lessonId: string
  published: boolean
  hasVideo: boolean
  title: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // A hidden lesson without a video can't be published (same rule as the DB);
  // a published one can always be hidden.
  const disabled = pending || (!published && !hasVideo)
  const hint = !published && !hasVideo ? 'Needs a YouTube video (video_ref) before it can be published' : undefined

  function toggle() {
    setError(null)
    startTransition(async () => {
      const result = await setLessonPublished(lessonId, !published)
      if (!result.ok) setError(result.message)
      router.refresh()
    })
  }

  return (
    <div className='flex flex-col items-end gap-1'>
      <span title={hint} className={disabled && !pending ? 'cursor-not-allowed' : undefined}>
        <button
          type='button'
          role='switch'
          aria-checked={published}
          aria-label={`${published ? 'Unpublish' : 'Publish'} “${title}”`}
          disabled={disabled}
          onClick={toggle}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ${
            published ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              published ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </span>
      {error && <span className='text-xs text-red-600'>{error}</span>}
    </div>
  )
}

export function PublishModuleButton({
  courseId,
  moduleId,
  ready,
}: {
  courseId: string
  moduleId: string | null
  /** Hidden lessons in this group that have a video. */
  ready: number
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function run() {
    if (!window.confirm(`Publish ${ready} lesson${ready === 1 ? '' : 's'}? They become visible to everyone.`)) return
    setMessage(null)
    startTransition(async () => {
      const result = await publishModuleLessons(courseId, moduleId)
      setMessage(result.ok ? `Published ${result.count ?? 0}.` : result.message)
      router.refresh()
    })
  }

  return (
    <div className='flex items-center gap-2'>
      {message && <span className='text-xs text-gray-600 dark:text-gray-400'>{message}</span>}
      <button
        type='button'
        onClick={run}
        disabled={pending || ready === 0}
        title={ready === 0 ? 'No hidden lessons with a video in this module' : undefined}
        className='rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40'
      >
        {pending ? 'Publishing…' : `Publish all with a video (${ready})`}
      </button>
    </div>
  )
}
