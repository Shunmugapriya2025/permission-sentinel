// In local development, the Vite proxy handles routing.
// In production, we use the live Render backend URL.
let API_BASE = import.meta.env.VITE_API_BASE_URL || "";
// Ensure No Trailing Slash
if (API_BASE.endsWith("/")) {
  API_BASE = API_BASE.slice(0, -1);
}

export interface PermissionDetail {
  name: string;
  risk: string;
  description?: string;
  risk_explanation?: string;
  purpose?: string;
  recommendation?: string;
}

export interface RiskyKeyword {
  keyword: string;
  category: string;
}

export interface ItemBreakdown {
  name: string;
  percentage: number;
  severity?: string;
  category?: string;
}

export interface RiskBreakdown {
  permissions: ItemBreakdown[];
  keywords: ItemBreakdown[];
  patterns: ItemBreakdown[];
  totals: {
    permissions: number;
    keywords: number;
    patterns: number;
  };
}

export interface AnalysisResult {
  app_name?: string;
  risk_level: "Low" | "Medium" | "High";
  risk_score: number;
  risk_percentage: number;
  risk_breakdown: RiskBreakdown;
  detected_content_type?: string;
  summary: string;
  permissions_detected: PermissionDetail[];
  risky_keywords_detected: RiskyKeyword[];
  recommendations: string[];
  ai_explanation: string;
  stats: {
    words_analyzed: number;
    permissions_count: number;
    keywords_count: number;
    patterns_count: number;
  };
  ocr_extracted_text_preview?: string;
  app_status_flag?: string;
  risk_summary?: {
    low: number;
    medium: number;
    high: number;
  };
}

// Raw shape returned by the FastAPI backend
interface BackendPermission {
  permission?: string;
  name?: string;
  severity?: string;
  risk?: string;
  matched_term?: string;
  reason?: string;
  description?: string;
  risk_explanation?: string;
  purpose?: string;
  recommendation?: string;
}

interface BackendKeyword {
  term?: string;
  keyword?: string;
  category?: string;
  count?: number;
  context?: string;
}

interface BackendStats {
  words_analyzed?: number;
  permissions_count?: number;
  risky_keywords_count?: number;
  keywords_count?: number;
  sharing_patterns_count?: number;
  patterns_count?: number;
}

interface BackendResponse {
  app_name?: string;
  risk_level: "Low" | "Medium" | "High";
  risk_score: number;
  summary: string;
  ai_explanation?: string;
  ai_summary?: string;
  permissions_detected?: BackendPermission[];
  risky_keywords_detected?: BackendKeyword[];
  recommendations?: string[];
  stats?: BackendStats;
  ocr_extracted_text_preview?: string;
  app_status_flag?: string;
  detected_content_type?: string;
  risk_percentage?: number;
  risk_breakdown?: RiskBreakdown;
  risk_summary?: {
    low: number;
    medium: number;
    high: number;
  };
}

/** Normalise the backend response into the shape the UI expects */
function normalise(raw: BackendResponse): AnalysisResult {
  const permissions: PermissionDetail[] = (raw.permissions_detected ?? []).map(
    (p) => ({
      name: p.name ?? p.permission ?? "Unknown",
      risk: p.risk ?? p.severity ?? "Unknown",
      description: p.description ?? p.reason ?? p.matched_term,
      risk_explanation: p.risk_explanation,
      purpose: p.purpose,
      recommendation: p.recommendation,
    })
  );

  const keywords: RiskyKeyword[] = (raw.risky_keywords_detected ?? []).map(
    (k) => ({
      keyword: k.keyword ?? k.term ?? "Unknown",
      category: k.category ?? "Unknown",
    })
  );

  const stats = raw.stats ?? ({} as BackendStats);

  return {
    app_name: raw.app_name,
    risk_level: raw.risk_level,
    risk_score: raw.risk_score,
    risk_percentage: raw.risk_percentage ?? 0,
    risk_breakdown: raw.risk_breakdown ?? {
      permissions: [],
      keywords: [],
      patterns: [],
      totals: { permissions: 0, keywords: 0, patterns: 0 },
    },
    detected_content_type: raw.detected_content_type,
    summary: raw.summary ?? raw.ai_summary ?? "",
    ai_explanation: raw.ai_explanation ?? "",
    permissions_detected: permissions,
    risky_keywords_detected: keywords,
    recommendations: raw.recommendations ?? [],
    stats: {
      words_analyzed: stats.words_analyzed ?? 0,
      permissions_count: stats.permissions_count ?? 0,
      keywords_count:
        stats.keywords_count ?? stats.risky_keywords_count ?? 0,
      patterns_count:
        stats.patterns_count ?? stats.sharing_patterns_count ?? 0,
    },
    ocr_extracted_text_preview: raw.ocr_extracted_text_preview,
    app_status_flag: raw.app_status_flag,
    risk_summary: raw.risk_summary,
  };
}

export async function analyzePermissions(
  input: { text?: string; image?: File; appName: string }
): Promise<AnalysisResult> {
  const formData = new FormData();

  if (input.appName) {
    formData.append("app_name", input.appName);
  }

  if (input.image) {
    formData.append("file", input.image);
  } else if (input.text) {
    formData.append("text", input.text);
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const err = await response.json();
      detail = err.detail ?? detail;
    } catch {
      // ignore parse errors
    }
    throw new Error(`Analysis failed: ${detail}`);
  }

  const raw: BackendResponse = await response.json();
  return normalise(raw);
}
