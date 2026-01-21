export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Name Here
        </h1>
        <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-8">
          Full Stack Developer | Designer | Creator
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            View Projects
          </button>
          <button className="px-8 py-3 border-2 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold rounded-lg transition-colors">
            Contact Me
          </button>
        </div>
      </div>
    </section>
  );
}
