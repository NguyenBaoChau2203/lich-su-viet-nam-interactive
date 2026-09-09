import process from "node:process";
import { pathToFileURL } from "node:url";

const secretFilePattern =
  /(^|[\\/\s"'])(\.env(?:\.[a-z0-9_-]+)?|[^\\/\s"']+\.(?:pem|p12|pfx)|(?:credentials|service-account)(?:\.[a-z0-9_-]+)?\.json)(?=$|[\\/\s"'])/i;

const destructivePatterns = [
  /^git\s+reset\s+--hard\b/i,
  /^git\s+clean\s+-(?=[a-z]*f)(?=[a-z]*d)[a-z]+\b/i,
  /^git\s+checkout\s+--(?:\s|$)/i,
  /^git\s+push\b.*(?:--force(?:-with-lease)?|-f)(?:\s|$)/i,
  /^(?:rm|sudo\s+rm)\s+-(?=[a-z]*r)(?=[a-z]*f)[a-z]+\s+(?:\/|~|\$home|\$env:userprofile)(?:\s|$)/i,
  /^remove-item\b(?=.*-recurse\b)(?=.*-force\b).*\s(?:[a-z]:\\|\.|\.\/|~|\$home|\$env:userprofile)["']?\s*$/i,
  /^(?:format(?:\.com)?\s+[a-z]:|mkfs(?:\.|\s)|diskpart\b)/i,
  /^(?:del|erase)\s+.*\/(?:s|q)\b.*(?:[a-z]:\\|\\|\s\.)(?:\s|$)/i,
  /^(?:rd|rmdir)\s+.*\/(?:s|q)\b.*(?:[a-z]:\\|\\|\s\.)(?:\s|$)/i,
];

export function extractCommand(payload) {
  return (
    payload?.tool_input?.command ??
    payload?.tool_input?.cmd ??
    payload?.tool_args?.CommandLine ??
    payload?.tool_args?.command ??
    payload?.toolArgs?.command ??
    payload?.command ??
    ""
  );
}

function executableSegments(command) {
  return command
    .split(/(?:\r?\n|&&|\|\||;|\|)/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/^&\s*/, "")
        .replace(/^cmd(?:\.exe)?\s+\/c\s+/i, "")
        .replace(
          /^(?:powershell|pwsh)(?:\.exe)?\b.*?\s-command\s+["']?/i,
          "",
        )
        .replace(/^["']/, ""),
    );
}

export function classifyCommand(command) {
  if (typeof command !== "string" || command.trim() === "") {
    return { allowed: false, reason: "Blocked: hook payload has no command." };
  }

  for (const segment of executableSegments(command)) {
    if (destructivePatterns.some((pattern) => pattern.test(segment))) {
      return {
        allowed: false,
        reason: `Blocked: destructive command requires an explicit manual review (${segment.slice(0, 120)}).`,
      };
    }
  }

  const withoutTemplates = command.replace(/\.env\.example\b/gi, "");
  if (secretFilePattern.test(withoutTemplates)) {
    return {
      allowed: false,
      reason: "Blocked: do not read, print, or stage secret-bearing files through an agent command.",
    };
  }

  return { allowed: true };
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  try {
    const raw = await readStdin();
    const payload = JSON.parse(raw || "{}");
    const result = classifyCommand(extractCommand(payload));

    if (!result.allowed) {
      process.stderr.write(`${result.reason}\n`);
      process.exitCode = 2;
    }
  } catch (error) {
    process.stderr.write(
      `Blocked: command guard could not parse the hook payload (${error.message}).\n`,
    );
    process.exitCode = 2;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
