export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-indigo-950">
              Scholar<span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="text-indigo-600 font-semibold">
              Cari Beasiswa
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Daftar Beasiswa
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Tentang Kami
            </a>
          </div>

          {/* CTA Button */}
          <div>
            <button
              id="btn-nav-login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Masuk / Daftar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
