const API_KEY = process.env.PAGESPEED_API_KEY;
const API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface PageSpeedScores {
  mobile: number;
  desktop: number;
}

async function fetchScore(
  url: string,
  strategy: "mobile" | "desktop"
): Promise<number | null> {
  if (!API_KEY) return null;

  try {
    const params = new URLSearchParams({
      url,
      strategy,
      key: API_KEY,
      category: "performance",
    });

    const res = await fetch(`${API_URL}?${params}`, {
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const score =
      data?.lighthouseResult?.categories?.performance?.score;
    return score != null ? Math.round(score * 100) : null;
  } catch {
    return null;
  }
}

export async function fetchPageSpeedScores(
  url: string
): Promise<PageSpeedScores | null> {
  const [mobile, desktop] = await Promise.all([
    fetchScore(url, "mobile"),
    fetchScore(url, "desktop"),
  ]);

  if (mobile === null && desktop === null) return null;

  return {
    mobile: mobile ?? 0,
    desktop: desktop ?? 0,
  };
}
