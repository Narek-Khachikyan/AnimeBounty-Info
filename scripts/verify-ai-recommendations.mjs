import { readFileSync } from "node:fs";

const files = {
  component: readFileSync("src/components/AiRecommendations/AiRecommendations.jsx", "utf8"),
  env: readFileSync(".env.example", "utf8"),
  function: readFileSync("netlify/functions/ai-recommendations.mjs", "utf8"),
  helper: readFileSync("src/features/aiRecommendations.js", "utf8"),
  netlify: readFileSync("netlify.toml", "utf8"),
};

const checks = [
  ["env documents GEMINI_API_KEY", files.env.includes("GEMINI_API_KEY=")],
  ["env defaults to current free Gemini model", files.env.includes("GEMINI_MODEL=gemini-3.1-flash-lite")],
  ["function keeps default model server-side", files.function.includes('DEFAULT_MODEL = "gemini-3.1-flash-lite"')],
  [
    "function uses structured JSON output",
    files.function.includes("responseMimeType: \"application/json\"") && files.function.includes("responseJsonSchema"),
  ],
  ["client maps planning to plan", files.helper.includes("planning: \"plan\"")],
  ["client posts to Netlify function", files.helper.includes("/.netlify/functions/ai-recommendations")],
  ["client filters saved recommendation duplicates", files.helper.includes("filterDuplicateRecommendations")],
  ["component hydrates recommendations through Jikan search", files.component.includes("useLazyGetAnimeSearchQuery")],
  ["netlify functions directory configured", files.netlify.includes('functions = "netlify/functions"')],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length > 0) {
  failed.forEach(([name]) => console.error(`AI recommendation check failed: ${name}`));
  process.exit(1);
}

process.env.GEMINI_API_KEY = "test-key";
process.env.GEMINI_MODEL = "test-model";

const originalFetch = globalThis.fetch;
let requestedSchema;

globalThis.fetch = async (_url, options) => {
  const requestBody = JSON.parse(options.body);
  requestedSchema = requestBody.generationConfig.responseJsonSchema;

  return {
    ok: true,
    status: 200,
    json: async () => ({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  recommendations: [
                    {
                      basedOn: ["Cowboy Bebop"],
                      confidence: 0.8,
                      reason: "Wrong media fixture.",
                      title: "Wrong Manga",
                      type: "manga",
                    },
                    {
                      basedOn: ["Cowboy Bebop"],
                      confidence: 0.9,
                      reason: "Correct media fixture.",
                      title: "Correct Anime",
                      type: "anime",
                    },
                  ],
                }),
              },
            ],
          },
        },
      ],
    }),
  };
};

try {
  const { handler } = await import("../netlify/functions/ai-recommendations.mjs");
  const response = await handler({
    body: JSON.stringify({
      count: 3,
      mediaType: "anime",
      items: [
        { id: 1, status: "completed", title: "Cowboy Bebop", type: "anime" },
        { id: 2, status: "plan", title: "Trigun", type: "anime" },
      ],
    }),
    httpMethod: "POST",
  });
  const payload = JSON.parse(response.body);
  const typeEnum = requestedSchema?.properties?.recommendations?.items?.properties?.type?.enum;

  if (response.statusCode !== 200) {
    throw new Error(`expected 200, received ${response.statusCode}`);
  }

  if (JSON.stringify(typeEnum) !== JSON.stringify(["anime"])) {
    throw new Error(`expected anime-only schema enum, received ${JSON.stringify(typeEnum)}`);
  }

  if (payload.recommendations.length !== 1 || payload.recommendations[0].type !== "anime") {
    throw new Error("expected anime-only recommendations after parsing");
  }
} catch (error) {
  console.error(`AI recommendation behavior check failed: ${error.message}`);
  process.exit(1);
} finally {
  globalThis.fetch = originalFetch;
}

console.log(`AI recommendation checks passed: ${checks.length + 1}`);
