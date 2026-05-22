import { expect, test } from "@playwright/test";

const seedLibrary = () => {
  window.localStorage.setItem("animebounty:user-library:v1", JSON.stringify([
    {
      favorite: true,
      id: 1,
      imageUrl: "",
      route: "/anime/1",
      savedAt: "2026-01-01T00:00:00.000Z",
      score: 8.9,
      status: "completed",
      title: "Cowboy Bebop",
      type: "anime",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      favorite: false,
      id: 2,
      imageUrl: "",
      route: "/manga/2",
      savedAt: "2026-01-02T00:00:00.000Z",
      score: 9.4,
      status: "planning",
      title: "Berserk",
      type: "manga",
      updatedAt: "2026-01-02T00:00:00.000Z",
    },
    {
      favorite: false,
      id: 3,
      imageUrl: "",
      route: "/anime/3",
      savedAt: "2026-01-03T00:00:00.000Z",
      score: null,
      status: "dropped",
      title: "A slow show",
      type: "anime",
      updatedAt: "2026-01-03T00:00:00.000Z",
    },
  ]));
};

test("library can request status-based AI recommendations", async ({ page }) => {
  await page.addInitScript(seedLibrary);

  await page.route("**/.netlify/functions/ai-recommendations", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    expect(body.items.map((item) => item.status)).toEqual(["completed", "plan", "dropped"]);
    expect(body.items[0]).toEqual(expect.objectContaining({
      favorite: true,
      id: 1,
      title: "Cowboy Bebop",
      type: "anime",
    }));

    await route.fulfill({
      body: JSON.stringify({
        model: "gemini-3.1-flash-lite",
        recommendations: [
          {
            basedOn: ["Cowboy Bebop"],
            confidence: 0.86,
            reason: "Fast character travel should fit your completed favorites while avoiding dropped slow pacing.",
            title: "Samurai Champloo",
            type: "anime",
          },
        ],
      }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.route("https://api.jikan.moe/v4/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const isSamuraiSearch = requestUrl.pathname === "/v4/anime" && requestUrl.searchParams.get("q") === "Samurai Champloo";
    const body = isSamuraiSearch
      ? {
        data: [{
          images: { webp: { image_url: "https://cdn.example.test/samurai.webp" } },
          mal_id: 205,
          score: 8.5,
          title: "Samurai Champloo",
        }],
      }
      : { data: [] };

    await route.fulfill({
      body: JSON.stringify(body),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto("/library");
  await page.getByRole("button", { name: "Generate picks" }).click();

  await expect(page.getByRole("heading", { name: "Samurai Champloo" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Search anime" })).toHaveAttribute("href", "/anime?q=Samurai%20Champloo");
  await expect(page.getByText("Generated with gemini-3.1-flash-lite")).toBeVisible();
});
