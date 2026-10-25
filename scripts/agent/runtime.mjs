import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
export const isMain = (url) => Boolean(process.argv[1]) && url === pathToFileURL(path.resolve(process.argv[1])).href;

// Only fixed tool names/flags go through cmd.exe to support npm's Windows shims.
// Paths and user input belong in cwd/env, never in this command string.
export function runTool(command, args, options = {}) {
  if (![command, ...args].every(value => /^[a-zA-Z0-9_./:@=+-]+$/.test(value))) {
    throw new Error("runTool accepts fixed tool names and flags only.");
  }
  return spawnSync(process.platform === "win32" ? "cmd.exe" : command,
    process.platform === "win32" ? ["/d", "/s", "/c", [command, ...args].join(" ")] : args,
    { cwd: projectRoot, encoding: "utf8", timeout: 30_000, windowsHide: true, ...options });
}
