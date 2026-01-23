import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch projects from Supabase
  const { data: projects } = await supabase
    .from('projects')
    .select(
      `
      *,
      project_links(*),
      project_media(*)
    `,
    )
    .order('sort_order', { ascending: true })

  return (
    <div className='max-w-6xl mx-auto'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-5xl font-bold mb-6'>Projects</h1>
        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <p className='text-lg leading-relaxed mb-4'>
            Each project in this portfolio represents a{' '}
            <strong>real, working solution</strong> — not just a demo.
          </p>
          <p className='text-zinc-700 dark:text-zinc-300 mb-6'>
            Every project includes:
          </p>
          <ul className='space-y-3 text-zinc-700 dark:text-zinc-300 mb-8'>
            <li>
              <strong>Title & Description</strong> — A clear explanation of the
              problem and how the solution works.
            </li>
            <li>
              <strong>Tech Stack</strong> — Displayed as visual chips (e.g.
              React, React Native, TypeScript, Node.js, Supabase).
            </li>
            <li>
              <strong>Live Links</strong> — Live website, GitHub repository,
              Play Store / App Store, demo videos.
            </li>
            <li>
              <strong>Gallery Images</strong> — Screenshots showing web UI,
              mobile UI, dashboards, and admin panels.
            </li>
          </ul>
          <p className='text-base text-zinc-600 dark:text-zinc-400 border-l-4 border-blue-500 pl-4 italic'>
            Visitors can click into each project to explore the functionality,
            view the interface, and navigate directly to the live product. This
            structure allows recruiters and clients to verify your skills
            immediately, without guessing.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects && projects.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {projects.map((project) => (
            <div
              key={project.id}
              className='bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-shadow'
            >
              {/* Project Image */}
              {project.project_media?.[0]?.url && (
                <div className='aspect-video bg-zinc-100 dark:bg-zinc-700 overflow-hidden relative'>
                  <Image
                    src={project.project_media[0].url}
                    alt={project.project_media[0].alt || project.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              <div className='p-6'>
                {/* Featured Badge */}
                {project.featured && (
                  <span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full mb-3'>
                    ⭐ Featured
                  </span>
                )}

                {/* Title */}
                <h2 className='text-2xl font-bold mb-2'>{project.title}</h2>

                {/* Summary */}
                {project.summary && (
                  <p className='text-zinc-600 dark:text-zinc-400 mb-4'>
                    {project.summary}
                  </p>
                )}

                {/* Description */}
                {project.description && (
                  <p className='text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3'>
                    {project.description}
                  </p>
                )}

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {project.tech_stack.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {project.project_links && project.project_links.length > 0 && (
                  <div className='flex flex-wrap gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-700'>
                    {project.project_links.map(
                      (link: {
                        id: string
                        url: string
                        link_text: string
                      }) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors'
                        >
                          {link.link_text}
                        </a>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl'>
          <p className='text-lg text-zinc-600 dark:text-zinc-400'>
            No projects yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}
