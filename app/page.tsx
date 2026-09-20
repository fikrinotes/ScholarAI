import Navbar from "@/components/Navbar";
import ScholarshipForm from "@/components/ScholarshipForm";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 flex-1">
        {/* Hero / Header */}
        <div className="text-center mb-8">

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Temukan Beasiswa Impian Sesuai Profilmu
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base max-w-2xl mx-auto">
            Isi kriteria akademik dan minat Anda. Sistem Kecerdasan Buatan (AI)
            kami akan menganalisis dan mencocokkan peluang terbaik untuk Anda
            secara objektif.
          </p>
        </div>

        {/* Form + Results (Client Component) */}
        <ScholarshipForm />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ScholarAI — Didukung oleh Google Gemini AI
      </footer>
    </>
  );
}
