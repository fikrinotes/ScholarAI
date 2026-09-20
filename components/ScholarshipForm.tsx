"use client";

import { useState } from "react";
import ResultsSection, { ScholarshipResult } from "./ResultsSection";

interface FormData {
  jenjang: string;
  ipk: string;
  bahasa: string[];
  minat: string;
  lokasi: string;
}

const LANGUAGE_OPTIONS = [
  { value: "Indonesia", label: "B. Indonesia" },
  { value: "Inggris (TOEFL/IELTS)", label: "B. Inggris" },
  { value: "Jepang (JLPT)", label: "B. Jepang" },
  { value: "Lainnya", label: "Bahasa Lain" },
];

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 1l2.3 7.1H22l-6.2 4.5 2.4 7.3L12 15.4l-6.2 4.5 2.4-7.3L2 7.1h7.7L12 1z" />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Memuat rekomendasi"
      className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"
    />
  );
}

export default function ScholarshipForm() {
  const [formData, setFormData] = useState<FormData>({
    jenjang: "S1",
    ipk: "3.65",
    bahasa: ["Indonesia", "Inggris (TOEFL/IELTS)", "Jepang (JLPT)"],
    minat: "Teknik Informatika & Data Science",
    lokasi: "Luar Negeri (Asia)",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScholarshipResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleBahasaChange(value: string, checked: boolean) {
    setFormData((prev) => ({
      ...prev,
      bahasa: checked
        ? [...prev.bahasa, value]
        : prev.bahasa.filter((b) => b !== value),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error ?? `Request gagal dengan status ${res.status}`
        );
      }

      const data: ScholarshipResult[] = await res.json();
      setResults(data);

      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("resultsSection")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 md:p-8 mb-10">
        <form id="scholarshipForm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Jenjang Pendidikan */}
            <div>
              <label
                htmlFor="jenjang"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Jenjang Pendidikan Target
              </label>
              <select
                id="jenjang"
                value={formData.jenjang}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, jenjang: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">-- Pilih Jenjang --</option>
                <option value="D3/D4">D3 / D4 (Vokasi)</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="S2">S2 (Magister)</option>
                <option value="S3">S3 (Doktoral)</option>
              </select>
            </div>

            {/* 2. IPK */}
            <div>
              <label
                htmlFor="ipk"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                IPK Terakhir / Saat Ini
              </label>
              <input
                type="number"
                id="ipk"
                step="0.01"
                min="0"
                max="4.00"
                value={formData.ipk}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, ipk: e.target.value }))
                }
                placeholder="Contoh: 3.50"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* 3. Bahasa */}
            <div className="md:col-span-2">
              <fieldset>
                <legend className="block text-sm font-semibold text-slate-700 mb-2">
                  Kemampuan Bahasa yang Dikuasai
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <label
                      key={lang.value}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={lang.value}
                        checked={formData.bahasa.includes(lang.value)}
                        onChange={(e) =>
                          handleBahasaChange(lang.value, e.target.checked)
                        }
                        className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                      />
                      <span>{lang.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* 4. Bidang Minat */}
            <div>
              <label
                htmlFor="minat"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Bidang Minat Studi
              </label>
              <select
                id="minat"
                value={formData.minat}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, minat: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="Teknik Informatika &amp; Data Science">
                  Teknik Informatika &amp; Data Science
                </option>
                <option value="Ekonomi &amp; Bisnis">Ekonomi &amp; Bisnis</option>
                <option value="Kesehatan &amp; Kedokteran">
                  Kesehatan &amp; Kedokteran
                </option>
                <option value="Seni &amp; Desain">Seni &amp; Desain</option>
                <option value="Ilmu Sosial &amp; Hukum">
                  Ilmu Sosial &amp; Hukum
                </option>
                <option value="MIPA &amp; Sains">MIPA &amp; Sains</option>
              </select>
            </div>

            {/* 5. Lokasi */}
            <div>
              <label
                htmlFor="lokasi"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Target Lokasi Beasiswa
              </label>
              <select
                id="lokasi"
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, lokasi: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="Dalam Negeri">Dalam Negeri (Indonesia)</option>
                <option value="Luar Negeri (Asia)">Luar Negeri (Asia)</option>
                <option value="Luar Negeri (Eropa/Amerika)">
                  Luar Negeri (Eropa / Amerika)
                </option>
                <option value="Semua">Semua Lokasi</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              id="btnSubmit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-indigo-500/30 inline-flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <SparklesIcon />
              <span>{loading ? "Menganalisis..." : "Cari Rekomendasi AI"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12" aria-live="polite">
          <Spinner />
          <p className="text-slate-600 font-medium mt-4">
            AI sedang menganalisis profil Anda dan mencocokkan dengan database
            beasiswa...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <p className="text-red-700 font-medium text-sm">⚠️ {error}</p>
          <p className="text-red-500 text-xs mt-1">
            Pastikan GEMINI_API_KEY sudah dikonfigurasi dengan benar.
          </p>
        </div>
      )}

      {/* Results */}
      {results && !loading && <ResultsSection results={results} />}
    </>
  );
}
