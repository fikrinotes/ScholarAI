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
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY belum dikonfigurasi. Silakan baca panduan setup di README.",
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
      { error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  const { jenjang, ipk, bahasa, minat, lokasi } = body;

  if (!jenjang || !ipk || !minat || !lokasi) {
    return NextResponse.json(
      { error: "Data form tidak lengkap." },
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
Rekomendasikan 3 beasiswa paling sesuai dengan profil di atas. Prioritaskan beasiswa yang NYATA dan aktif (seperti MEXT, GKS, LPDP, Fulbright, Chevening, dll).

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

  // 4. Call Gemini API
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 5. Parse JSON from response
    // Strip potential markdown code fences
    const cleaned = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let scholarships: ScholarshipResult[];
    try {
      scholarships = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response as JSON:", text);
      return NextResponse.json(
        {
          error:
            "AI mengembalikan format yang tidak terduga. Silakan coba lagi.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(scholarships);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Gemini API error:", message);
    return NextResponse.json(
      { error: `Gagal menghubungi Gemini API: ${message}` },
      { status: 502 }
    );
  }
}
