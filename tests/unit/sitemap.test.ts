import sitemap from "@/app/sitemap";

const originalAppUrl = process.env.APP_URL;
const originalVercelUrl = process.env.VERCEL_URL;

afterEach(() => {
  if (originalAppUrl === undefined) delete process.env.APP_URL;
  else process.env.APP_URL = originalAppUrl;

  if (originalVercelUrl === undefined) delete process.env.VERCEL_URL;
  else process.env.VERCEL_URL = originalVercelUrl;
});

describe("sitemap deployment URLs", () => {
  it("prefers an explicitly configured application URL", () => {
    process.env.APP_URL = "https://nurtureops.example";
    process.env.VERCEL_URL = "nurtureops-preview.vercel.app";

    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://nurtureops.example/",
      "https://nurtureops.example/about",
      "https://nurtureops.example/privacy",
      "https://nurtureops.example/terms",
    ]);
  });

  it("uses the unique Vercel deployment URL when APP_URL is absent", () => {
    delete process.env.APP_URL;
    process.env.VERCEL_URL = "nurtureops-preview.vercel.app";

    expect(
      sitemap().every(({ url }) => url.startsWith("https://nurtureops-preview.vercel.app/")),
    ).toBe(true);
  });
});
