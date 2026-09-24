import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------
interface RequestBody {
  jenjang: string;
  ipk: string;
  bahasa: string[];
  minat: string;
  lokasi: string;
}

export interface ScholarshipResult {
  name: string;
  country: string;
  type: string;
  matchPercent: number;
  aiReasoning: string;
  level: string;
  minGpa: number;
  deadline: string;
  applyUrl?: string;
}

// ---------------------------------------------------------------
// POST /api/recommend
// ---------------------------------------------------------------
export async function POST(req: NextRequest) {
  // 1. Validate API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      {
        error:
          "Konfigurasi GEMINI_API_KEY belum diatur di server (.env.local). Silakan tambahkan API key terlebih dahulu.",
      },
      { status: 500 }
    );
  }

  // 2. Parse request body
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format data request tidak valid. Silakan coba lagi." },
      { status: 400 }
    );
  }

  const { jenjang, ipk, bahasa, minat, lokasi } = body;

  if (!jenjang || !ipk || !minat || !lokasi) {
    return NextResponse.json(
      { error: "Mohon lengkapi semua data formulir terlebih dahulu." },
      { status: 400 }
    );
  }

  // 3. Build prompt
  const bahasaStr =
    bahasa && bahasa.length > 0 ? bahasa.join(", ") : "tidak disebutkan";

  const prompt = `
Kamu adalah sistem AI penasihat beasiswa bernama ScholarAI yang sangat berpengalaman dan selalu memberikan rekomendasi faktual dan spesifik.

Berdasarkan profil mahasiswa Indonesia berikut:
- Jenjang pendidikan yang dituju: ${jenjang}
- IPK saat ini: ${ipk} (skala 4.00)
- Kemampuan bahasa: ${bahasaStr}
- Bidang minat studi: ${minat}
- Target lokasi beasiswa: ${lokasi}

Tugasmu:
Rekomendasikan 3 beasiswa paling sesuai dengan profil di atas. Prioritaskan beasiswa yang NYATA dan aktif (seperti MEXT, GKS, LPDP, Fulbright, Chevening, AAS, DAAD, dll).

PENTING: Balasnya HANYA dengan JSON array yang valid, tanpa markdown, tanpa penjelasan apapun di luar JSON. Format setiap item adalah:
{
  "name": "Nama resmi beasiswa",
  "country": "Negara penyelenggara",
  "type": "Full Scholarship / Partial Scholarship",
  "matchPercent": <angka 0-100 seberapa cocok dengan profil ini>,
  "aiReasoning": "Alasan spesifik mengapa beasiswa ini cocok untuk profil mahasiswa ini (2-3 kalimat dalam Bahasa Indonesia)",
  "level": "${jenjang}",
  "minGpa": <IPK minimum sebagai angka desimal>,
  "deadline": "Perkiraan deadline pendaftaran (contoh: 30 Mei 2026)",
  "applyUrl": "URL resmi halaman pendaftaran atau info beasiswa"
}

Urutkan dari matchPercent tertinggi ke terendah. Berikan 3 item.
`;

  // 4. Call Gemini API with model fallbacks
  const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];
  const genAI = new GoogleGenerativeAI(apiKey);

  let lastError: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const scholarships: ScholarshipResult[] = JSON.parse(cleaned);
      return NextResponse.json(scholarships);
    } catch (err: unknown) {
      console.warn(`Model ${modelName} failed:`, err);
      lastError = err;

      if (err instanceof SyntaxError) {
        return NextResponse.json(
          {
            error:
              "Format tanggapan AI mengalami kendala. Silakan coba beberapa saat lagi.",
          },
          { status: 502 }
        );
      }
    }
  }

  // If all model attempts failed, analyze the last error to return a user-friendly message
  const errStr = lastError instanceof Error ? lastError.message : String(lastError);
  console.error("Gemini API error summary:", errStr);

  let userFriendlyMessage =
    "Maaf, terjadi kendala saat menghubungkan ke layanan AI. Silakan coba lagi nanti.";

  if (
    errStr.includes("API_KEY_INVALID") ||
    errStr.includes("API key not valid") ||
    (errStr.includes("400") && errStr.toLowerCase().includes("key"))
  ) {
    userFriendlyMessage =
      "Kunci API (GEMINI_API_KEY) tidak valid. Mohon periksa kembali API Key di file .env.local Anda.";
  } else if (
    errStr.includes("503") ||
    errStr.includes("Service Unavailable") ||
    errStr.includes("high demand") ||
    errStr.includes("429") ||
    errStr.includes("Quota")
  ) {
    userFriendlyMessage =
      "Layanan AI sedang sibuk atau mengalami peningkatan trafik. Silakan tunggu beberapa saat dan coba tekan tombol cari lagi.";
  } else if (
    errStr.includes("fetch failed") ||
    errStr.includes("ENOTFOUND") ||
    errStr.includes("ECONNREFUSED")
  ) {
    userFriendlyMessage =
      "Gagal terhubung ke jaringan server AI. Mohon periksa koneksi internet Anda.";
  }

  return NextResponse.json({ error: userFriendlyMessage }, { status: 502 });
}
