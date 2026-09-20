export interface ScholarshipResult {
  name: string;
  country: string;
  type: string; // e.g. "Full Scholarship"
  matchPercent: number;
  aiReasoning: string;
  level: string; // e.g. "S1"
  minGpa: number;
  deadline: string;
  applyUrl?: string;
}

interface ResultsSectionProps {
  results: ScholarshipResult[];
}

// Match badge color thresholds
function getMatchColor(pct: number) {
  if (pct >= 85)
    return {
      wrapper: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: "text-emerald-600",
    };
  if (pct >= 70)
    return {
      wrapper: "bg-amber-50 text-amber-700 border border-amber-200",
      icon: "text-amber-500",
    };
  return {
    wrapper: "bg-slate-100 text-slate-600 border border-slate-200",
    icon: "text-slate-400",
  };
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
    </svg>
  );
}

function RobotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-indigo-600"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7 13.5c-.83 0-1.5-.67-1.5-1.5S6.17 10.5 7 10.5s1.5.67 1.5 1.5S7.83 13.5 7 13.5zM9.5 17l-1.5-1 1.5-1 1.5 1-1.5 1zm3.5 0l-1.5-1 1.5-1 1.5 1L13 17zm1.5-3.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <div id="resultsSection">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Hasil Rekomendasi Beasiswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Diurutkan berdasarkan skor kesesuaian terbesar yang dihitung AI
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {results.length} Beasiswa Ditemukan
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-5">
        {results.map((item, idx) => {
          const matchColor = getMatchColor(item.matchPercent);
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {item.country}
                    </span>
                    <span className="text-xs text-slate-400">
                      • {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.name}
                  </h3>
                </div>
                {/* Match Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${matchColor.wrapper}`}
                >
                  <CheckCircleIcon />
                  <span className="text-sm font-extrabold">
                    {item.matchPercent}% Match
                  </span>
                </div>
              </div>

              {/* AI Reasoning Box */}
              <div className="my-4 bg-indigo-50/60 border border-indigo-100 rounded-lg p-4 text-xs md:text-sm text-indigo-950">
                <div className="font-semibold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <RobotIcon />
                  <span>Analisis Rekomendasi AI:</span>
                </div>
                <p className="leading-relaxed">{item.aiReasoning}</p>
              </div>

              {/* Card Footer */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4 pt-2">
                <div className="flex gap-4 flex-wrap">
                  <span>
                    <strong className="text-slate-700">Jenjang:</strong>{" "}
                    {item.level}
                  </span>
                  <span>
                    <strong className="text-slate-700">Min. IPK:</strong>{" "}
                    {item.minGpa.toFixed(2)}
                  </span>
                  <span>
                    <strong className="text-slate-700">Deadline:</strong>{" "}
                    {item.deadline}
                  </span>
                </div>
                <a
                  href={item.applyUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Lihat Detail &amp; Syarat
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
