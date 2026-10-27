import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { assertSupportedSchema, canonical, parseStrictJson, validateSchema } from "./local-heroes-schema.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DEFAULT_PACKAGE = "supabase/content/local-heroes/national-v1";
const schemaPath = "docs/audits/2026-10-26-local-heroes-manifest.schema.json";
const schemaBytes = fs.readFileSync(path.join(root, schemaPath));
const schema = parseStrictJson(schemaBytes.toString("utf8"));
assertSupportedSchema(schema);
export const FILES = ["claims", "coverage", "localities", "media", "people", "relations", "roster", "sources", "stories"];
const hash = (v) => crypto.createHash("sha256").update(v).digest("hex");
const fold = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[đĐ]/gu, "d").toLocaleLowerCase("vi").trim();
const sorted = (v) => JSON.stringify(v) === JSON.stringify([...v].sort());
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
export const countStoryWords = (v) => v.replace(/\[\[cite:[^\]]+\]\]/gu, "").replace(/^\s*#{1,6}\s+/gmu, "").replace(/\*\*|__/gu, "").trim().split(/\p{White_Space}+/u).filter(Boolean).length;
const issue = (code, at, message, personKey = null, localityCode = null) => ({ code, path: at, message, personKey, localityCode });
const result = (mode, m, issues, counts = {}) => ({ schemaVersion: 1, mode, valid: issues.length === 0, releaseReady: false, manifestVersion: Number.isInteger(m?.version) ? m.version : 0, manifestHash: typeof m?.manifestHash === "string" ? m.manifestHash : "", acceptedPeople: 0, completeAcceptedPeople: 0, representedLocalities: 0, totalLocalities: 34, ...counts, issues });

export function loadPackage(directory = DEFAULT_PACKAGE) {
  const base = path.resolve(root, directory), documents = {}, bytes = {}, issues = [];
  for (const n of [...FILES, "manifest"]) {
    try {
      const filename = path.join(base, n + ".json");
      if (fs.lstatSync(base).isSymbolicLink() || fs.lstatSync(filename).isSymbolicLink() || path.dirname(fs.realpathSync(filename)) !== fs.realpathSync(base) || fs.statSync(filename).size > 8 * 1024 * 1024) throw new Error("Unsafe package file");
      bytes[n] = fs.readFileSync(filename);
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes[n]);
      documents[n] = parseStrictJson(text);
      if (text !== text.normalize("NFC") || text !== JSON.stringify(documents[n], null, 2) + "\n") issues.push(issue("SCHEMA", n + ".json", "Expected canonical UTF-8/NFC, two-space indentation, LF and final newline."));
    } catch { issues.push(issue("SCHEMA", n + ".json", "Unreadable, unsafe or malformed JSON (including duplicate keys).")); }
  }
  return { documents, bytes, issues };
}

export function validateDocuments(documents, { mode = "research", initialIssues = [] } = {}) {
  const d = documents && typeof documents === "object" ? documents : {}, issues = [...initialIssues];
  const add = (ok, code, at, message, personKey = null, localityCode = null) => { if (!ok) issues.push(issue(code, at, message, personKey, localityCode)); };
  for (const n of [...FILES, "manifest"]) {
    const def = schema.$defs[n === "manifest" ? "manifest" : n + "Document"];
    issues.push(...validateSchema(d[n], def, schema, n + ".json").map((x) => issue("SCHEMA", x.path, x.message)));
  }
  if (issues.length) return finish(result(mode, d.manifest, issues));
  function inspect(v, at, key = "") {
    if (typeof v === "string") {
      add(v === v.normalize("NFC") && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/u.test(v), "SCHEMA", at, "Non-NFC or control text.");
      if (key === "localPath" || key === "schemaFile" || key === "evidenceRef") add(!v.includes("..") && !v.includes("\\") && !path.isAbsolute(v) && !v.includes(":"), "REFERENCE", at, "Unsafe local path.");
      if (key === "body" || key === "biography") add(!/<\/?[a-z!]|!\[|\]\(\s*(?:javascript|data|vbscript):/iu.test(v), "STORY", at, "Unsupported rich text.");
    } else if (Array.isArray(v)) {
      if (/(?:Ids|Keys|Codes)$/u.test(key)) add(sorted(v) && new Set(v).size === v.length, "REFERENCE", at, "Unsorted or duplicate references.");
      if (key === "sourceRefs") add(sorted(v.map((x) => x.sourceId)) && new Set(v.map((x) => x.sourceId)).size === v.length, "REFERENCE", at, "Unsorted or repeated citation sources.");
      v.forEach((x, i) => inspect(x, at + "[" + i + "]"));
    } else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) inspect(x, at + "." + k, k);
  }
  for (const [n, doc] of Object.entries(d)) inspect(doc, n + ".json");
  const maps = Object.fromEntries(["people", "roster", "claims", "sources", "media", "stories", "relations"].map((n) => [n, new Map()]));
  for (const [n, map] of Object.entries(maps)) {
    const key = ["people", "roster"].includes(n) ? "personKey" : "id", ids = d[n].records.map((x) => x[key]);
    add(sorted(ids), "SCHEMA", n + ".json.records", "Records must be sorted by stable identity.");
    for (const r of d[n].records) { add(!map.has(r[key]), "IDENTITY", n + ".json." + r[key], "Duplicate identity."); map.set(r[key], r); }
  }
  const codes = schema.$defs.locality.properties.code.enum;
  add(same(d.localities.records.map((r) => r.code), codes) && sorted(d.localities.records.map((r) => r.code)), "COVERAGE", "localities.json", "Registry must contain the exact 34 ordered codes.");
  add(same(d.coverage.records.map((r) => r.code), codes) && sorted(d.coverage.records.map((r) => r.code)), "COVERAGE", "coverage.json", "Coverage must contain the exact 34 ordered codes.");
  add(same([...maps.people.keys()], [...maps.roster.keys()]), "ROSTER", "roster.json", "Every nominated person needs a roster decision.");
  const ref = (collection, id, at) => { add(maps[collection].has(id), "REFERENCE", at, "Missing " + collection + " reference."); return maps[collection].get(id); };
  const sourceReady = (id) => maps.sources.get(id)?.decision === "accepted" && maps.sources.get(id)?.checkedStatus === "checked";
  const claimReady = (id) => { const c = maps.claims.get(id); return c?.decision === "accepted" && c.sourceRefs.length > 0 && c.sourceRefs.every((x) => sourceReady(x.sourceId)); };
  const owners = { person: "people", story: "stories", relation: "relations", media: "media" };
  for (const c of d.claims.records) {
    ref(owners[c.subjectKind], c.subjectKey, "claims.json." + c.id);
    for (const s of c.sourceRefs) ref("sources", s.sourceId, "claims.json." + c.id);
    if (c.decision === "accepted") {
      add(!/\b(?:TODO|FIXME)\b/iu.test([c.text, c.uncertaintyNote, ...c.sourceRefs.flatMap((r) => [r.locator, r.scopeNote])].join(" ")), "CLAIM", "claims.json." + c.id, "Internal editorial note in accepted public evidence.");
      add(claimReady(c.id), "CLAIM", "claims.json." + c.id, "Accepted claim requires checked accepted sources.");
      if (c.certainty === "disputed") add(new Set(c.sourceRefs.map((s) => maps.sources.get(s.sourceId)?.independenceKey)).size >= 2, "CLAIM", "claims.json." + c.id, "Disputed claim requires independent origins.");
    }
  }
  const identities = new Set(), slugs = new Set(), canonicalIds = new Set(), tuples = new Set();
  for (const p of d.people.records) {
    add(!identities.has(fold(p.name)) && !slugs.has(p.slug) && (!p.existingFigureId || !canonicalIds.has(p.existingFigureId)), "IDENTITY", "people.json." + p.personKey, "Duplicate person/name/slug or canonical ID.", p.personKey);
    identities.add(fold(p.name)); slugs.add(p.slug); if (p.existingFigureId) canonicalIds.add(p.existingFigureId);
    add(p.existingFigureId ? p.personKey === "figure:" + p.existingFigureId && p.existingIdentityChecked : p.personKey === "new:" + p.slug, "IDENTITY", "people.json." + p.personKey, "Canonical key reconciliation required.", p.personKey);
    for (const id of p.claimIds) { const c = ref("claims", id, "people.json." + p.personKey); add(c?.decision === "accepted" && (c.subjectKind === "person" && c.subjectKey === p.personKey || c.subjectKind === "relation" && maps.relations.get(c.subjectKey)?.personKey === p.personKey), "CLAIM", "people.json." + p.personKey, "Foreign or held active claim.", p.personKey); }
    if (p.mainStoryId) add(ref("stories", p.mainStoryId, "people.json." + p.personKey)?.personKey === p.personKey, "REFERENCE", "people.json." + p.personKey, "Foreign primary story.");
    if (p.representativeMediaId) add(ref("media", p.representativeMediaId, "people.json." + p.personKey)?.personKey === p.personKey, "REFERENCE", "people.json." + p.personKey, "Foreign representative image.");
  }
  const eligible = [];
  for (const r of d.relations.records) {
    ref("people", r.personKey, "relations.json." + r.id);
    const tuple = r.personKey + "/" + r.localityCode + "/" + r.kind;
    add(!tuples.has(tuple), "IDENTITY", "relations.json." + r.id, "Duplicate locality relationship."); tuples.add(tuple);
    if (r.claimId) ref("claims", r.claimId, "relations.json." + r.id);
    if (r.decision === "accepted") {
      const c = maps.claims.get(r.claimId);
      const valid = claimReady(r.claimId) && c.subjectKind === "relation" && c.subjectKey === r.id && c.key === "locality:" + r.localityCode + ":" + r.kind && c.certainty === r.certainty;
      add(valid, "CLAIM", "relations.json." + r.id, "Requires a sourced historical-to-reference locality mapping.", r.personKey, r.localityCode);
      if (valid && r.certainty === "verified" && r.kind !== "commemoration") eligible.push(r);
    }
  }
  for (const s of d.stories.records) {
    ref("people", s.personKey, "stories.json." + s.id);
    const claims = s.claimIds.map((id) => ref("claims", id, "stories.json." + s.id));
    if (s.decision === "accepted") {
      add(!/\b(?:TODO|FIXME)\b/iu.test(s.title + " " + s.summary + " " + s.body), "STORY", "stories.json." + s.id, "Internal editorial note in public story text.", s.personKey);
      add(claims.length > 0 && claims.every((c) => c?.subjectKind === "story" && c.subjectKey === s.id && claimReady(c.id)), "STORY", "stories.json." + s.id, "Story needs its own accepted scoped citations.", s.personKey);
      const keys = claims.filter(Boolean).map((c) => c.key), markers = [...s.body.matchAll(/\[\[cite:([^\]]+)\]\]/gu)].map((x) => x[1]);
      add(new Set(keys).size === keys.length && markers.length > 0 && markers.every((k) => keys.includes(k)) && !s.body.replace(/\[\[cite:[^\]]+\]\]/gu, "").includes("[[cite:"), "STORY", "stories.json." + s.id, "Unknown, duplicate or malformed citation marker.", s.personKey);
      add(s.body.split(/\n\s*\n/u).every((p) => /^\s*#{1,6} /u.test(p) || /\[\[cite:[^\]]+\]\]/u.test(p)), "STORY", "stories.json." + s.id, "Every narrative paragraph requires a scoped citation.", s.personKey);
      add(!s.isPrimary || countStoryWords(s.body) >= 350 && countStoryWords(s.body) <= 700, "STORY", "stories.json." + s.id, "Primary narrative must contain 350–700 words.", s.personKey);
    }
  }
  for (const m of d.media.records) {
    ref("people", m.personKey, "media.json." + m.id);
    if (m.identityClaimId) ref("claims", m.identityClaimId, "media.json." + m.id);
    if (m.usageClaimId) ref("claims", m.usageClaimId, "media.json." + m.id);
    if (m.decision !== "accepted") continue;
    const extension = path.extname(m.localPath || new URL(m.fileUrl || "https://example.invalid/no-extension").pathname).toLowerCase();
    add(!extension || [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].includes(extension), "MEDIA", "media.json." + m.id, "Representative media must use a supported raster image format.", m.personKey);
    const c = maps.claims.get(m.identityClaimId);
    add(c?.subjectKind === "media" && c.subjectKey === m.id && c.certainty === "verified" && claimReady(c.id), "MEDIA", "media.json." + m.id, "Image identity/context is not independently evidenced.", m.personKey);
    add(m.depictionKind !== "historical_context" || m.caption.includes("Tư liệu bối cảnh, không phải chân dung"), "MEDIA", "media.json." + m.id, "Context image requires its honest caption.", m.personKey);
    add(m.creator !== null || m.institution !== null || /không (?:rõ|được ghi)/iu.test(m.caption), "MEDIA", "media.json." + m.id, "Credit or honest unknown authorship required.", m.personKey);
    if (m.usageBasis !== "coursework_reference") { const usage = maps.claims.get(m.usageClaimId); add(usage?.subjectKind === "media" && usage.subjectKey === m.id && claimReady(usage.id), "MEDIA", "media.json." + m.id, "Usage needs a scoped accepted rights claim.", m.personKey); }
    if (m.usageBasis === "open_license") add(Boolean(m.license && m.licenseUrl), "MEDIA", "media.json." + m.id, "Open license needs a specific license and URL.", m.personKey);
  }
  let acceptedPeople = 0, completeAcceptedPeople = 0;
  const complete = new Set();
  for (const r of d.roster.records) {
    const p = ref("people", r.personKey, "roster.json." + r.personKey);
    for (const id of r.nominationSourceIds) ref("sources", id, "roster.json." + r.personKey);
    if (!p || r.decision !== "accepted") continue;
    acceptedPeople++;
    const own = p.claimIds.map((id) => maps.claims.get(id)).filter((c) => c?.subjectKind === "person" && c.subjectKey === p.personKey);
    const has = (k, verified = false) => own.some((c) => c.key === k && claimReady(c.id) && (!verified || c.certainty === "verified"));
    add(["identity", "contribution", "period"].every((k) => has(k)) && eligible.some((x) => x.personKey === p.personKey) && p.contributionStartYear !== null && p.contributionEndYear !== null && p.contributionStartYear <= p.contributionEndYear && p.contributionStartYear <= 1975 && p.contributionEndYear >= 1858, "ROSTER", "roster.json." + r.personKey, "Selected person lacks sourced category/period/locality eligibility.", r.personKey);
    if (r.readiness !== "complete") continue;
    const s = maps.stories.get(p.mainStoryId), m = maps.media.get(p.representativeMediaId);
    const ready = ["identity", "contribution", "period", ...(p.biography ? ["biography"] : []), ...(p.birthYear !== null ? ["birth_year"] : []), ...(p.deathYear !== null ? ["death_year"] : []), ...(p.aliases.length ? ["aliases"] : [])].every((k) => has(k, ["identity", "contribution", "period", "aliases"].includes(k))) && s?.personKey === p.personKey && s.decision === "accepted" && s.isPrimary && m?.personKey === p.personKey && m.decision === "accepted" && Boolean(p.contributionSummary);
    add(ready, "ROSTER", "roster.json." + r.personKey, "Falsely claimed complete person.", r.personKey);
    if (ready) { complete.add(p.personKey); completeAcceptedPeople++; }
  }
  let representedLocalities = 0;
  for (const c of d.coverage.records) {
    const candidates = [...new Set(d.roster.records.filter((r) => r.nominatedLocalityCodes.includes(c.code)).map((r) => r.personKey))];
    const accepted = [...new Set(eligible.filter((r) => r.localityCode === c.code && maps.roster.get(r.personKey)?.decision === "accepted").map((r) => r.personKey))];
    const prepared = accepted.filter((k) => complete.has(k));
    add(same(c.candidatePersonKeys, candidates) && same(c.acceptedPersonKeys, accepted) && same(c.completePersonKeys, prepared), "COVERAGE", "coverage.json." + c.code, "Coverage sets differ from distinct qualified/completed people.", null, c.code);
    add(c.status !== "represented" || d.coverage.publicSnapshot !== null, "COVERAGE", "coverage.json." + c.code, "Unobserved public availability cannot be claimed.", null, c.code);
    add(!["ready_for_review", "represented"].includes(c.status) || prepared.length > 0, "COVERAGE", "coverage.json." + c.code, "Prepared coverage requires a complete person/story/image.", null, c.code);
    if (prepared.length) representedLocalities++;
  }
  const snapshot = d.coverage.publicSnapshot;
  if (snapshot !== null) {
    const observedCodes = snapshot.byLocality.map((r) => r.code);
    add(same(observedCodes, codes) && sorted(observedCodes) && new Set(observedCodes).size === 34, "COVERAGE", "coverage.json.publicSnapshot.byLocality", "Observed coverage needs all 34 distinct ordered codes.");
    const sum = snapshot.byLocality.reduce((n, r) => n + r.eligiblePeople, 0), max = Math.max(0, ...snapshot.byLocality.map((r) => r.eligiblePeople));
    add(snapshot.representedLocalities === snapshot.byLocality.filter((r) => r.eligiblePeople > 0).length && snapshot.eligiblePeople >= max && snapshot.eligiblePeople <= sum && snapshot.eligiblePeople <= completeAcceptedPeople, "COVERAGE", "coverage.json.publicSnapshot", "Observed distinct-person/locality counts exceed prepared evidence or disagree internally.");
    for (const observed of snapshot.byLocality) {
      const prepared = d.coverage.records.find((r) => r.code === observed.code);
      add(observed.eligiblePeople <= (prepared?.completePersonKeys.length ?? 0) && (prepared?.status !== "represented" || observed.eligiblePeople > 0), "COVERAGE", "coverage.json.publicSnapshot." + observed.code, "Public locality counts require complete accepted people and positive represented coverage.", null, observed.code);
    }
  }
  const manifest = { ...d.manifest }; delete manifest.manifestHash; delete manifest.ownerApproval;
  add(hash(JSON.stringify(canonical(manifest))) === d.manifest.manifestHash, "HASH", "manifest.json.manifestHash", "Manifest content hash mismatch.");
  add(d.manifest.schemaSha256 === hash(schemaBytes) && d.manifest.schemaFile === schemaPath, "HASH", "manifest.json.schemaSha256", "Frozen schema hash/path mismatch.");
  add(same(d.manifest.files.map((f) => f.name), FILES.map((f) => f + ".json")) && sorted(d.manifest.files.map((f) => f.name)), "HASH", "manifest.json.files", "Expected exactly nine ordered component files.");
  const approval = d.manifest.ownerApproval;
  const approvalReady = approval.status === "approved" && approval.manifestHash === d.manifest.manifestHash;
  const valid = issues.length === 0;
  const releaseReady = valid && representedLocalities === 34 && acceptedPeople > 0 && completeAcceptedPeople === acceptedPeople && d.manifest.rosterFrozen && approvalReady;
  if (mode === "release" && !releaseReady) {
    for (const c of d.coverage.records) issues.push(issue("COVERAGE", "coverage.json." + c.code, "Research status " + c.status + "; complete selected people: " + c.completePersonKeys.length + ".", null, c.code));
    if (completeAcceptedPeople !== acceptedPeople) issues.push(issue("ROSTER", "roster.json", "Every selected person must be complete before national release."));
    if (!approvalReady || !d.manifest.rosterFrozen) issues.push(issue("APPROVAL", "manifest.json.ownerApproval", "Matching actual owner approval and frozen roster required."));
  }
  const out = result(mode, d.manifest, issues, { acceptedPeople, completeAcceptedPeople, representedLocalities });
  // Release incompleteness is not a schema/provenance failure.
  out.valid = valid;
  out.releaseReady = releaseReady;
  return finish(out);
}

function finish(out) {
  const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  out.issues.sort((a, b) => compare(a.path, b.path) || compare(a.code, b.code) || compare(a.personKey ?? "", b.personKey ?? "") || compare(a.localityCode ?? "", b.localityCode ?? ""));
  return out;
}

export function validatePackage(directory = DEFAULT_PACKAGE, mode = "research") {
  const { documents, bytes, issues } = loadPackage(directory);
  const m = documents.manifest;
  for (const f of Array.isArray(m?.files) ? m.files : []) {
    if (!FILES.some((n) => f.name === n + ".json")) { issues.push(issue("HASH", "manifest.json.files", "Unsafe or unknown component path.")); continue; }
    const actual = bytes[f.name.slice(0, -5)];
    if (!actual || hash(actual) !== f.sha256) issues.push(issue("HASH", "manifest.json.files." + f.name, "Component byte hash mismatch."));
  }
  if (m?.ownerApproval?.status === "approved") {
    const evidence = m.ownerApproval.evidenceRef;
    try {
      if (typeof evidence !== "string" || !/^docs\/audits\/[a-z0-9-]+\.md$/u.test(evidence)) throw new Error();
      const filename = path.join(root, evidence), real = fs.realpathSync(filename);
      if (!real.startsWith(fs.realpathSync(root) + path.sep) || fs.lstatSync(filename).isSymbolicLink() || !fs.readFileSync(filename, "utf8").includes(m.manifestHash)) throw new Error();
    } catch { issues.push(issue("APPROVAL", "manifest.json.ownerApproval.evidenceRef", "Versioned approval evidence is missing or does not name this hash.")); }
  }
  if (documents.coverage?.publicSnapshot) {
    const snapshot = documents.coverage.publicSnapshot;
    try {
      if (!/^docs\/audits\/[a-z0-9-]+\.md$/u.test(snapshot.evidenceRef)) throw new Error();
      const filename = path.join(root, snapshot.evidenceRef), real = fs.realpathSync(filename);
      if (!real.startsWith(fs.realpathSync(root) + path.sep) || fs.lstatSync(filename).isSymbolicLink()) throw new Error();
      const evidence = fs.readFileSync(filename, "utf8");
      if (!evidence.includes(snapshot.manifestHash) || !evidence.includes(snapshot.observedAt)) throw new Error();
    } catch { issues.push(issue("COVERAGE", "coverage.json.publicSnapshot.evidenceRef", "A public snapshot needs versioned observation evidence naming its observed hash and time.")); }
  }
  return validateDocuments(documents, { mode, initialIssues: issues });
}
