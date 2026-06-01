function Loader({ message = "Fetching data from server...", fullPage = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 ${
        fullPage ? "min-h-[55vh] w-full" : "py-16 px-4"
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative h-20 w-20">
        <div className="loader-orbit absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-emerald-400" />
        <div
          className="loader-orbit-reverse absolute inset-2 rounded-full border-2 border-transparent border-b-violet-400 border-l-blue-300"
          style={{ animationDuration: "1.4s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loader-pulse h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>
        <div className="loader-glow absolute -inset-3 rounded-full bg-blue-500/20 blur-xl" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-zinc-200 max-w-[16rem] sm:max-w-xs px-2 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="loader-dot h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="loader-dot loader-dot-delay-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="loader-dot loader-dot-delay-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
