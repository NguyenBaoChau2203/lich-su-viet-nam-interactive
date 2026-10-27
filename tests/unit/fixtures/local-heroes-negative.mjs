// Synthetic negative controls cloned in memory. No modified claim is written to the approved research package.
import { loadPackage } from "../../../scripts/content/local-heroes-validator.mjs";
export function negativeCases() {
  const base = loadPackage().documents;
  const cases = [
    ["unknown field", "SCHEMA", (d) => { d.people.records[0].SYNTHETIC_FORGED_ROLE = "admin"; }],
    ["unknown locality", "SCHEMA", (d) => { d.coverage.records[0].code = "99"; }],
    ["missing source access provenance", "SCHEMA", (d) => { d.sources.records.find((s) => s.decision === "accepted").accessedAt = null; }],
    ["blank source institution is not provenance", "SCHEMA", (d) => { const s = d.sources.records.find((s) => s.decision === "accepted"); s.authorOrg = "   "; s.publisher = null; }],
    ["blank locator is not scoped evidence", "SCHEMA", (d) => { d.claims.records.find((c) => c.decision === "accepted").sourceRefs[0].locator = "   "; }],
    ["invalid calendar date", "SCHEMA", (d) => { d.sources.records[0].accessedAt = "2026-02-31"; }],
    ["credentialed URL", "SCHEMA", (d) => { d.sources.records[0].url = "https://user:password@example.invalid/source"; }],
    ["unsafe URL scheme", "SCHEMA", (d) => { d.sources.records[0].url = "javascript:synthetic"; }],
    ["duplicate canonical identity", "IDENTITY", (d) => { d.people.records[1].slug = d.people.records[0].slug; }],
    ["broken source reference", "REFERENCE", (d) => { d.claims.records[0].sourceRefs[0].sourceId = "src-synthetic-missing"; }],
    ["held source cannot prove accepted claim", "CLAIM", (d) => { const c = d.claims.records.find((c) => c.decision === "accepted"); const s = d.sources.records.find((s) => s.id === c.sourceRefs[0].sourceId); s.decision = "held"; s.decisionReason = "Synthetic negative control"; }],
    ["requires a sourced historical-to-reference locality mapping", "CLAIM", (d) => { d.relations.records.find((r) => r.decision === "accepted").claimId = d.claims.records.find((c) => c.decision === "held").id; }],
    ["unknown story citation", "STORY", (d) => { d.stories.records.find((s) => s.decision === "accepted").body += " [[cite:synthetic-missing]]"; }],
    ["uncited story paragraph", "STORY", (d) => { d.stories.records.find((s) => s.decision === "accepted").body += "\n\nSynthetic unsupported paragraph."; }],
    ["unsupported rich text", "STORY", (d) => { d.stories.records.find((s) => s.decision === "accepted").body += "<script>SYNTHETIC</script>"; }],
    ["holds unknown identity and unknown usage without substituting a portrait", "MEDIA", (d) => { d.media.records.find((m) => m.decision === "accepted").identityClaimId = d.claims.records.find((c) => c.decision === "held").id; }],
    ["unsupported representative media", "MEDIA", (d) => { d.media.records.find((m) => m.decision === "accepted").fileUrl = "https://example.invalid/SYNTHETIC.exe"; }],
    ["missing contextual image label", "MEDIA", (d) => { d.media.records.find((m) => m.decision === "accepted" && m.depictionKind === "historical_context").caption = "Synthetic context without label"; }],
    ["held image cannot complete a selected person", "ROSTER", (d) => { const p = d.people.records.find((p) => d.roster.records.find((r) => r.personKey === p.personKey).readiness === "complete"); p.representativeMediaId = d.media.records.find((m) => m.personKey === p.personKey && m.decision === "held")?.id ?? d.media.records.find((m) => m.decision === "held").id; }],
    ["unsourced displayed alias", "ROSTER", (d) => { const p = d.people.records.find((p) => d.roster.records.find((r) => r.personKey === p.personKey).readiness === "complete"); p.claimIds = p.claimIds.filter((id) => d.claims.records.find((c) => c.id === id).key !== "aliases"); p.aliases = ["SYNTHETIC_UNSOURCED_ALIAS"]; }],
    ["falsely claimed locality coverage", "COVERAGE", (d) => { d.coverage.records[2].status = "represented"; }],
    ["inflated observed public snapshot", "COVERAGE", (d) => { d.coverage.publicSnapshot = { observedAt: "2026-10-26T00:00:00Z", manifestHash: d.manifest.manifestHash, representedLocalities: 1, eligiblePeople: 99, byLocality: d.coverage.records.map((c, i) => ({ code: c.code, eligiblePeople: i === 0 ? 99 : 0 })), evidenceRef: "docs/audits/SYNTHETIC-NOT-A-PUBLIC-OBSERVATION.md" }; }],
    ["manifest revision without updated hash", "HASH", (d) => { d.manifest.version++; }],
    ["non-NFC text", "SCHEMA", (d) => { d.people.records[0].name = "Synthetic Đặng"; }],
    ["internal editorial note", "STORY", (d) => { d.stories.records.find((s) => s.decision === "accepted").summary = "TODO SYNTHETIC private note"; }],
  ];
  return cases.map(([label, code, mutate]) => { const documents = structuredClone(base); mutate(documents); return { label, code, documents }; });
}
