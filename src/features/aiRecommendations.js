const AI_RECOMMENDATIONS_ENDPOINT = "/.netlify/functions/ai-recommendations";
const STATUS_TO_AI_STATUS = {
  completed: "completed",
  dropped: "dropped",
  plan: "plan",
  planning: "plan",
};

const normalizeTitleKey = (item) => `${item.type}:${String(item.title).trim().toLowerCase()}`;

export const mapLibraryStatusToAiStatus = (status) => STATUS_TO_AI_STATUS[status] ?? null;

export const buildAiLibraryProfile = (items) => (
  items
    .map((item) => ({
      favorite: Boolean(item.favorite),
      id: Number(item.id),
      score: item.score ?? null,
      status: mapLibraryStatusToAiStatus(item.status),
      title: item.title,
      type: item.type,
    }))
    .filter((item) => item.status && item.title && Number.isFinite(item.id))
);

export const getAiStatusSummary = (profile) => profile.reduce((summary, item) => ({
  ...summary,
  [item.status]: summary[item.status] + 1,
}), { completed: 0, dropped: 0, plan: 0 });

export const createSavedTitleSet = (items) => new Set(
  buildAiLibraryProfile(items).map(normalizeTitleKey)
);

export const filterDuplicateRecommendations = (recommendations, items) => {
  const savedTitles = createSavedTitleSet(items);

  return recommendations.filter((item) => !savedTitles.has(normalizeTitleKey(item)));
};

export const getSearchPathForRecommendation = (item) => `/${item.type}?q=${encodeURIComponent(item.title)}`;

export const normalizeHydratedRecommendation = (recommendation, searchPayload) => {
  const match = Array.isArray(searchPayload?.data) ? searchPayload.data[0] : null;
  const imageUrl =
    match?.images?.webp?.large_image_url ||
    match?.images?.webp?.image_url ||
    "";
  const title = match?.title_english || match?.title || recommendation.title;

  return {
    ...recommendation,
    imageUrl,
    malId: Number.isFinite(Number(match?.mal_id)) ? Number(match.mal_id) : null,
    route: Number.isFinite(Number(match?.mal_id)) ? `/${recommendation.type}/${Number(match.mal_id)}` : null,
    score: Number.isFinite(Number(match?.score)) ? Number(match.score) : null,
    searchPath: getSearchPathForRecommendation(recommendation),
    title,
  };
};

export const requestAiRecommendations = async ({ items, mediaType = "all", count = 6 }) => {
  const response = await fetch(AI_RECOMMENDATIONS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, items: buildAiLibraryProfile(items), mediaType }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "AI recommendations could not be loaded.");
  }

  return {
    model: payload.model,
    recommendations: Array.isArray(payload.recommendations) ? payload.recommendations : [],
  };
};
