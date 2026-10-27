// Validator for every keyword used by the frozen LH schema, not a general JSON Schema engine.
export const canonical = (v) => Array.isArray(v) ? v.map(canonical) : v && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canonical(v[k])])) : v;
const equal = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

export function parseStrictJson(text) {
  let i = 0;
  const white = () => { while (/[\x20\t\r\n]/u.test(text[i] ?? "") && i < text.length) i++; };
  function string() {
    const start = i++;
    while (i < text.length) {
      if (text[i] === "\\") { i += 2; continue; }
      if (text[i++] === '"') return JSON.parse(text.slice(start, i));
    }
    throw new Error("Unclosed JSON string");
  }
  function value(depth = 0) {
    if (depth > 60) throw new Error("JSON nesting exceeds limit");
    white();
    if (text[i] === "{") {
      i++; white(); const keys = new Set();
      if (text[i] === "}") { i++; return; }
      while (i < text.length) {
        white(); if (text[i] !== '"') throw new Error("Expected object key");
        const key = string(); if (keys.has(key)) throw new Error("Duplicate JSON key"); keys.add(key);
        white(); if (text[i++] !== ":") throw new Error("Expected colon");
        value(depth + 1); white(); const c = text[i++]; if (c === "}") return;
        if (c !== ",") throw new Error("Expected object delimiter");
      }
    } else if (text[i] === "[") {
      i++; white(); if (text[i] === "]") { i++; return; }
      while (i < text.length) { value(depth + 1); white(); const c = text[i++]; if (c === "]") return; if (c !== ",") throw new Error("Expected array delimiter"); }
    } else if (text[i] === '"') string();
    else {
      const m = text.slice(i).match(/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/u);
      if (!m) throw new Error("Invalid JSON value"); i += m[0].length;
    }
  }
  value(); white(); if (i !== text.length) throw new Error("Trailing JSON input");
  return JSON.parse(text);
}

const supported = new Set(["$schema", "$id", "$defs", "$ref", "title", "description", "type", "properties", "required", "additionalProperties", "items", "prefixItems", "minItems", "maxItems", "uniqueItems", "enum", "const", "minLength", "maxLength", "pattern", "format", "minimum", "maximum", "allOf", "anyOf", "oneOf", "if", "then", "else"]);
export function assertSupportedSchema(s) {
  if (typeof s === "boolean") return;
  for (const k of Object.keys(s)) if (!supported.has(k)) throw new Error("Unsupported schema keyword: " + k);
  for (const k of ["$defs", "properties"]) for (const v of Object.values(s[k] ?? {})) assertSupportedSchema(v);
  for (const k of ["allOf", "anyOf", "oneOf", "prefixItems"]) for (const v of s[k] ?? []) assertSupportedSchema(v);
  for (const k of ["items", "if", "then", "else"]) if (s[k] !== undefined) assertSupportedSchema(s[k]);
  if (typeof s.additionalProperties === "object") assertSupportedSchema(s.additionalProperties);
}

export function validateSchema(v, s, root, at = "$") {
  if (s === true) return [];
  if (s === false) return [{ path: at, message: "Forbidden value" }];
  if (s.$ref) {
    if (!s.$ref.startsWith("#/$defs/")) throw new Error("External schema reference denied");
    return validateSchema(v, root.$defs[s.$ref.slice(8)], root, at);
  }
  const errors = [], add = (message) => errors.push({ path: at, message });
  if (Object.hasOwn(s, "const") && !equal(v, s.const)) add("Constant mismatch");
  if (s.enum && !s.enum.some((x) => equal(v, x))) add("Unknown value");
  const type = Array.isArray(v) ? "array" : v === null ? "null" : typeof v;
  const matches = (t) => t === "integer" ? type === "number" && Number.isInteger(v) : t === "number" ? type === "number" && Number.isFinite(v) : t === type;
  if (s.type && !(Array.isArray(s.type) ? s.type : [s.type]).some(matches)) { add("Invalid value type"); return errors; }
  for (const x of s.allOf ?? []) errors.push(...validateSchema(v, x, root, at));
  if (s.anyOf && !s.anyOf.some((x) => validateSchema(v, x, root).length === 0)) add("No allowed alternative");
  if (s.oneOf && s.oneOf.filter((x) => validateSchema(v, x, root).length === 0).length !== 1) add("Expected exactly one alternative");
  if (s.if) { const branch = validateSchema(v, s.if, root).length === 0 ? s.then : s.else; if (branch !== undefined) errors.push(...validateSchema(v, branch, root, at)); }
  if (type === "object") {
    for (const k of s.required ?? []) if (!Object.hasOwn(v, k)) errors.push({ path: at + "." + k, message: "Required field missing" });
    for (const [k, x] of Object.entries(v)) {
      if (Object.hasOwn(s.properties ?? {}, k)) errors.push(...validateSchema(x, s.properties[k], root, at + "." + k));
      else if (s.additionalProperties === false) errors.push({ path: at + "." + k, message: "Unknown field" });
      else if (typeof s.additionalProperties === "object") errors.push(...validateSchema(x, s.additionalProperties, root, at + "." + k));
    }
  }
  if (type === "array") {
    if (s.minItems !== undefined && v.length < s.minItems) add("Too few records");
    if (s.maxItems !== undefined && v.length > s.maxItems) add("Too many records");
    if (s.uniqueItems && new Set(v.map((x) => JSON.stringify(canonical(x)))).size !== v.length) add("Duplicate records");
    v.forEach((x, i) => { const rule = s.prefixItems?.[i] ?? s.items; if (rule !== undefined) errors.push(...validateSchema(x, rule, root, at + "[" + i + "]")); });
  }
  if (type === "string") {
    const n = Array.from(v).length;
    // LH requires nonblank evidence text, in addition to JSON Schema's raw character length.
    if (s.minLength > 0 && v.trim().length === 0) add("Required text is blank");
    if (s.minLength !== undefined && n < s.minLength || s.maxLength !== undefined && n > s.maxLength) add("Invalid text length");
    if (s.pattern && !new RegExp(s.pattern, "u").test(v)) add("Pattern mismatch");
    if (s.format === "uuid" && !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/iu.test(v)) add("Invalid UUID");
    if (s.format === "date" && (!/^\d{4}-\d\d-\d\d$/u.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v)) add("Invalid calendar date");
    if (s.format === "date-time" && (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/u.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v.slice(0, 10))) add("Invalid UTC date/time");
    if (s.format === "uri") { try { const u = new URL(v); if (u.protocol !== "https:" || u.username || u.password || /[\s\u0000-\u001f\u007f]/u.test(v)) add("Unsafe HTTPS URL"); } catch { add("Invalid URL"); } }
  }
  if (type === "number" && (!Number.isSafeInteger(v) || s.minimum !== undefined && v < s.minimum || s.maximum !== undefined && v > s.maximum)) add("Invalid integer bound");
  return errors;
}
