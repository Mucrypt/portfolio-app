'use client'

import { useTransition } from 'react'
import { setMessageStatus } from './actions'

const NEXT: Record<string, { status: string; label: string }[]> = {
  new: [
    { status: 'read', label: 'Mark read' },
    { status: 'replied', label: 'Mark replied' },
    { status: 'archived', label: 'Archive' },
  ],
  read: [
    { status: 'replied', label: 'Mark replied' },
    { status: 'archived', label: 'Archive' },
  ],
  replied: [{ status: 'archived', label: 'Archive' }],
  archived: [{ status: 'read', label: 'Restore' }],
}

export default function StatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition()
  return (
    <div className='flex flex-wrap gap-2'>
      {(NEXT[status] ?? NEXT.new).map((n) => (
        <button
          key={n.status}
          type='button'
          disabled={pending}
          onClick={() =>
            start(async () => {
              const result = await setMessageStatus(id, n.status)
              if (!result.ok) alert(result.message)
            })
          }
          className='rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200'
        >
          {n.label}
        </button>
      ))}
    </div>
  )
}
