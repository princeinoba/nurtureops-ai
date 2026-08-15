import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const candidates = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  encoding: "utf8",
})
  .split(/\r?\n/)
  .filter(Boolean)
  .filter(
    (path) =>
      !path.startsWith(".evidence/") &&
      !path.startsWith(".tmp/") &&
      !path.startsWith("node_modules/") &&
      path !== "pnpm-lock.yaml" &&
      path !== "scripts/security-scan.mjs",
  );

const textExtensions = new Set([
  "",
  ".css",
  ".example",
  ".html",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".svg",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml",
]);

const forbidden = [
  ["private key", new RegExp("-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")],
  ["AWS access key", /AKIA[0-9A-Z]{16}/],
  ["OpenAI-style secret", /sk-[A-Za-z0-9_-]{20,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{30,}/],
  ["public server secret", /NEXT_PUBLIC_(?:AI|OPENAI|.*SECRET|SERVICE_ROLE|BANK)/],
  [
    "production email",
    /[A-Z0-9._%+-]+@(?!synthetic\.invalid\b|example\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}/i,
  ],
];

const findings = [];
for (const path of candidates) {
  if (!textExtensions.has(extname(path).toLowerCase())) continue;
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  for (const [label, pattern] of forbidden) {
    if (pattern.test(content)) findings.push(`${path}: ${label}`);
  }
}

const sourceFiles = candidates.filter((path) => /\.(?:ts|tsx|sql)$/.test(path));
for (const path of sourceFiles) {
  const content = readFileSync(path, "utf8");
  if (/amountMinor\s*:\s*\d+\.\d+/.test(content)) {
    findings.push(`${path}: floating-point money`);
  }
  if (/localStorage\.setItem\([^\n]*(?:allerg|medication|incident|message)/i.test(content)) {
    findings.push(`${path}: sensitive local-storage payload`);
  }
}

if (findings.length > 0) {
  console.error("Security scan failed:\n" + findings.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Security scan passed across ${candidates.length} tracked and candidate files.`);
