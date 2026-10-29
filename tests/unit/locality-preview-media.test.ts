import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LocalityPreviewCard } from "@/components/locality/LocalityPreviewCard";
import type { HeritageSiteSummary } from "@/lib/heritage/types";

describe("optional mixed-host locality preview", () => {
  it("renders an unconfigured storage origin with the existing heritage policy and keeps the detail link", () => {
    const item: HeritageSiteSummary = {
      id: "synthetic", slug: "synthetic-place", name: "Synthetic place", historicalName: null,
      locality: { code: "04", slug: "cao-bang", officialName: "Tỉnh Cao Bằng", referenceFramework: "VN-34-2025" },
      tier: "grade12", rank: 1, period: "Synthetic period", teaser: "Synthetic excerpt",
      latitude: 22, longitude: 106, accuracyLevel: "approximate", accuracyNote: "Synthetic uncertainty", lessonSlug: null, videos: [],
      cover: { url: "https://storage-unconfigured.example.invalid/cover.webp", alt: "Synthetic cover", focalPoint: null, era: "today", credit: "Synthetic credit", usageBasis: "coursework_reference" },
    };
    const html = renderToStaticMarkup(createElement(LocalityPreviewCard, { kind: "place", item, homeHref: "/?noi-dung=dia-phuong&dia-phuong=cao-bang" }));
    expect(html).toContain('src="https://storage-unconfigured.example.invalid/cover.webp"');
    expect(html).not.toContain("/_next/image");
    expect(html).toContain("/dia-diem/synthetic-place?kham-pha=");
    expect(html).toContain("Ảnh ngày nay");
    expect(html).toContain("Synthetic credit");
  });
});
