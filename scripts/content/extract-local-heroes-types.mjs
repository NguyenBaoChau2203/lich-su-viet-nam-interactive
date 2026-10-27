// Preserve legacy API refinements while taking the catalog definitions verbatim from CLI output.
// Usage: node scripts/content/extract-local-heroes-types.mjs <generated-input.ts>
import fs from "node:fs";
import ts from "typescript";

if (process.argv.length !== 3) throw new Error("Expected one Supabase generated TypeScript input path.");
const input = fs.readFileSync(process.argv[2], "utf8");
const source = ts.createSourceFile("generated.ts", input, ts.ScriptTarget.Latest, true);
const db = source.statements.find((s) => ts.isTypeAliasDeclaration(s) && s.name.text === "Database");
const pub = db?.type.members?.find((m) => m.name?.getText(source) === "public")?.type;
if (!pub?.members) throw new Error("Unsupported Supabase type output.");
const tables = new Set(["figure_localities", "figure_media_evidence", "figure_sources", "figure_stories", "figure_story_sources", "history_localities", "historical_figures"]);
const blocks = ["Tables", "Functions", "Enums"].map((name) => {
  const block = pub.members.find((m) => m.name?.getText(source) === name)?.type;
  if (!block?.members) throw new Error("Missing generated block: " + name);
  const members = block.members.filter((m) => name === "Tables" ? tables.has(m.name.getText(source)) : name === "Functions" ? m.name.getText(source).startsWith("local_hero_") : true);
  if (name === "Tables" && members.length !== 7 || name === "Functions" && members.length !== 8) throw new Error("Catalog type inventory mismatch.");
  return "    " + name + ": {\n" + members.map((m) => m.getText(source).replaceAll("\r\n", "\n").split("\n").map((line) => "      " + line.trimStart()).join("\n")).join("\n") + "\n    }";
});
const output = '// Generated from disposable PostgreSQL with Supabase CLI; regenerate, do not edit members.\n// Extraction keeps only the catalog tables/functions and their enum dependencies.\nimport type { Json } from "@/lib/database.types";\nexport type Database = {\n  public: {\n' + blocks.join("\n") + '\n    Views: { [_ in never]: never }\n    CompositeTypes: { [_ in never]: never }\n  }\n};\n';
fs.writeFileSync("lib/local-heroes/database.generated.ts", output);
process.stdout.write("Extracted 7 table and 8 function definitions from Supabase CLI output.\n");
