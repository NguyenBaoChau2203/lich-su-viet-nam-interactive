import { expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CompactTimeline } from "@/components/content/CompactTimeline";
it("carries a safe people return through an existing related-event link", () => {
  const home = "/?tu=1911&den=1975&noi-dung=nhan-vat&dia-phuong=ha-noi&q-nhan-vat=%C4%90%E1%BA%B7ng&trang-nhan-vat=2";
  const html = renderToStaticMarkup(createElement(CompactTimeline, { label: "Synthetic related events", explorerReturnHref: home, events: [{ slug: "synthetic-event", title: "Synthetic event", summary: "Synthetic fixture", dateText: "1954", datePrecision: "year", startYear: 1954, isFeatured: false, topicSlugs: [], secondaryTopics: [] }] }));
  expect(html).toContain(`/su-kien/synthetic-event?kham-pha=${encodeURIComponent(home)}`);
});
