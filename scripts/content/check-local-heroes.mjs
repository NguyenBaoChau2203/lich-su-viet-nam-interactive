import { validatePackage } from "./local-heroes-validator.mjs";

const args = process.argv.slice(2);
let directory, mode = "research", usage = false;
const seen = new Set();
for (let i = 0; i < args.length; i += 2) {
  const flag = args[i], value = args[i + 1];
  if (!["--package", "--mode"].includes(flag) || !value || value.startsWith("--") || seen.has(flag)) { usage = true; break; }
  seen.add(flag);
  if (flag === "--package") directory = value; else mode = value;
}
if (!["research", "release"].includes(mode)) usage = true;
if (usage) { process.stderr.write("Usage: node scripts/content/check-local-heroes.mjs [--package <local-directory>] [--mode research|release]\n"); process.exitCode = 64; }
else {
  const result = validatePackage(directory, mode);
  process.stdout.write(JSON.stringify(result) + "\n");
  process.exitCode = !result.valid ? 1 : mode === "release" && !result.releaseReady ? 2 : 0;
}
