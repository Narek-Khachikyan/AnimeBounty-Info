const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const VALID_STATUSES = new Set(["plan", "completed", "dropped"]);
const VALID_TYPES = new Set(["anime", "manga"]);

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    ...corsHeaders,
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const normalizeItem = (item) => ({
  id: Number(item.id),
  type: VALID_TYPES.has(item.type) ? item.type : "anime",
  title: String(item.title || "").slice(0, 120),
  status: VALID_STATUSES.has(item.status) ? item.status : "plan",
  score: Number.isFinite(Number(item.score)) ? Number(item.score) : null,
  favorite: Boolean(item.favorite),
});

const buildPrompt = ({ items, mediaType, count }) => {
  const grouped = {
    completed: items.filter((item) => item.status === "completed"),
    plan: items.filter((item) => item.status === "plan"),
    dropped: items.filter((item) => item.status === "dropped"),
  };

  return [
    "You are an anime and manga recommendation assistant.",
    "Recommend real anime or manga titles that can be found in MyAnimeList/Jikan.",
    "Use completed items as the strongest positive signal.",
    "Use plan items as medium intent signals and never recommend duplicates from that list.",
    "Use dropped items as negative signals and avoid close matches unless there is a clear reason.",
    `Recommend ${count} ${mediaType === "all" ? "anime or manga" : mediaType} titles.`,
    "Return concise reasons based only on the supplied library profile.",
    `Library profile: ${JSON.stringify(grouped)}`,
  ].join("\n");
};

const getAllowedRecommendationTypes = (mediaType) => (
  mediaType === "all" ? ["anime", "manga"] : [mediaType]
);

const buildRecommendationSchema = (mediaType) => ({
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: getAllowedRecommendationTypes(mediaType) },
          title: { type: "string" },
          reason: { type: "string" },
          confidence: { type: "number" },
          basedOn: { type: "array", items: { type: "string" } },
        },
        required: ["type", "title", "reason", "confidence", "basedOn"],
      },
    },
  },
  required: ["recommendations"],
});

const parseGeminiText = (payload, mediaType) => {
  const text = payload?.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;

  if (!text) {
    throw new Error("Gemini response did not include text.");
  }

  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed.recommendations)) {
    throw new Error("Gemini response did not include recommendations.");
  }

  return parsed.recommendations
    .filter((item) => (
      getAllowedRecommendationTypes(mediaType).includes(item.type) &&
      typeof item.title === "string"
    ))
    .slice(0, 8)
    .map((item) => ({
      type: item.type,
      title: item.title.slice(0, 120),
      reason: String(item.reason || "Recommended from your library profile.").slice(0, 260),
      confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0.5)),
      basedOn: Array.isArray(item.basedOn) ? item.basedOn.slice(0, 4).map(String) : [],
    }));
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { message: "Use POST for AI recommendations." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return json(500, { message: "Gemini API key is not configured." });
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { message: "Request body must be valid JSON." });
  }

  const items = Array.isArray(body.items) ? body.items.map(normalizeItem).filter((item) => item.title) : [];
  const signalItems = items.filter((item) => VALID_STATUSES.has(item.status));

  if (signalItems.length < 2) {
    return json(400, { message: "Save at least two planned, completed, or dropped titles first." });
  }

  const mediaType = ["all", "anime", "manga"].includes(body.mediaType) ? body.mediaType : "all";
  const count = Math.max(3, Math.min(8, Number(body.count) || 6));
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt({ items: signalItems, mediaType, count }) }] }],
        generationConfig: {
          maxOutputTokens: 1800,
          responseJsonSchema: buildRecommendationSchema(mediaType),
          responseMimeType: "application/json",
          temperature: 0.35,
        },
      }),
    });

    if (!response.ok) {
      const statusCode = response.status === 429 ? 429 : 502;
      return json(statusCode, { message: "AI recommendations are temporarily unavailable. Please retry." });
    }

    const recommendations = parseGeminiText(await response.json(), mediaType);
    return json(200, { model, recommendations });
  } catch {
    return json(502, { message: "AI recommendations are temporarily unavailable. Please retry." });
  }
};
