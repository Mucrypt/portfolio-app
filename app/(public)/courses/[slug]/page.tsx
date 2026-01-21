import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type Course = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string;
  thumbnail_url: string | null;
  instructor_name: string;
  platform: string;
  affiliate_link: string;
  original_price: number | null;
  discounted_price: number | null;
  currency: string;
  duration_hours: number | null;
  level: string;
  category: string;
  language: string;
  rating: number | null;
  students_count: number;
  what_you_learn: string[] | null;
  requirements: string[] | null;
  tags: string[] | null;
};

function formatPrice(price: number | null, currency: string) {
  if (!price) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!course) {
    notFound();
  }

  const typedCourse = course as Course;

  // Get related courses
  const { data: relatedCourses } = await supabase
    .from("courses")
    .select("id, title, slug, thumbnail_url, instructor_name, platform, discounted_price, original_price, currency, level, rating")
    .eq("category", typedCourse.category)
    .eq("is_published", true)
    .neq("id", typedCourse.id)
    .limit(3);

  const discountPercentage = typedCourse.original_price && typedCourse.discounted_price
    ? Math.round(((typedCourse.original_price - typedCourse.discounted_price) / typedCourse.original_price) * 100)
    : null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-purple-950/20" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          <Link href="/courses" className="hover:text-purple-600 transition-colors">
            Courses
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-semibold">{typedCourse.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold">
                  {typedCourse.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-bold">
                  {typedCourse.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-bold">
                  {typedCourse.platform}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4">
                {typedCourse.title}
              </h1>

              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">
                {typedCourse.short_description}
              </p>

              <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <span>👨‍🏫</span>
                  <span className="font-semibold">{typedCourse.instructor_name}</span>
                </div>
                {typedCourse.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{typedCourse.rating}</span>
                    {typedCourse.students_count > 0 && (
                      <span>({typedCourse.students_count.toLocaleString()} students)</span>
                    )}
                  </div>
                )}
                {typedCourse.duration_hours && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{typedCourse.duration_hours}h total</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>🌍</span>
                  <span>{typedCourse.language}</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 aspect-video bg-linear-to-br from-blue-600 via-purple-600 to-pink-600">
              {typedCourse.thumbnail_url ? (
                <img src={typedCourse.thumbnail_url} alt={typedCourse.title} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-8xl font-black opacity-20">
                  📚
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">
                About This Course
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {typedCourse.description}
                </p>
              </div>
            </div>

            {/* What You'll Learn */}
            {typedCourse.what_you_learn && typedCourse.what_you_learn.length > 0 && (
              <div className="mb-8 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-6">
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {typedCourse.what_you_learn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {typedCourse.requirements && typedCourse.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {typedCourse.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                      <span className="text-purple-600">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {typedCourse.tags && typedCourse.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typedCourse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 blur-xl" />
                <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm p-8">
                  {/* Price */}
                  <div className="mb-6">
                    {typedCourse.discounted_price ? (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-4xl font-black text-zinc-900 dark:text-white">
                            {formatPrice(typedCourse.discounted_price, typedCourse.currency)}
                          </span>
                          {discountPercentage && (
                            <span className="px-2 py-1 rounded-lg bg-green-500 text-white text-sm font-black">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                        {typedCourse.original_price && (
                          <span className="text-lg text-zinc-400 dark:text-zinc-500 line-through">
                            {formatPrice(typedCourse.original_price, typedCourse.currency)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-4xl font-black text-zinc-900 dark:text-white">
                        {formatPrice(typedCourse.original_price, typedCourse.currency)}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={typedCourse.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 rounded-xl font-black text-center bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl transition-all hover:scale-105 mb-4"
                  >
                    Enroll Now →
                  </a>

                  <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mb-6">
                    You'll be redirected to {typedCourse.platform}
                  </p>

                  {/* Course Includes */}
                  <div className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-black text-zinc-900 dark:text-white mb-4">
                      This course includes:
                    </h3>
                    {typedCourse.duration_hours && (
                      <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                        <span className="text-purple-600">🎥</span>
                        <span>{typedCourse.duration_hours} hours on-demand video</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="text-purple-600">📱</span>
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="text-purple-600">♾️</span>
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                      <span className="text-purple-600">🏆</span>
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        {relatedCourses && relatedCourses.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">
              Related Courses
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedCourses.map((related: any) => (
                <Link
                  key={related.id}
                  href={`/courses/${related.slug}`}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/70 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="aspect-video bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 relative">
                    {related.thumbnail_url ? (
                      <img src={related.thumbnail_url} alt={related.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl opacity-20">
                        📚
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {related.instructor_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-zinc-900 dark:text-white">
                        {formatPrice(related.discounted_price || related.original_price, related.currency)}
                      </span>
                      <span className="text-sm font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
