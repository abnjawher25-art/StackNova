import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "app/page.tsx",
  "app/account/page.tsx",
  "app/ProgressCloudSync.tsx",
  "app/learn/html/page.tsx",
  "app/learn/html/roadmap/page.tsx",
  "app/learn/html/[lesson]/page.tsx",
  "app/learn/html/progress/page.tsx",
  "app/learn/css/page.tsx",
  "app/learn/css/[lesson]/page.tsx",
  "app/learn/javascript/page.tsx",
  "app/learn/javascript/[lesson]/page.tsx",
  "app/practice/page.tsx",
  "app/reference/page.tsx",
  "app/projects/page.tsx",
  "app/projects/portfolio/page.tsx",
  "app/not-found.tsx",
  "app/error.tsx",
  "app/loading.tsx",
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("StackNova route check failed. Missing required files:");
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
if (!packageJson.scripts?.build) {
  console.error("StackNova route check failed: package.json is missing the build script.");
  process.exit(1);
}

console.log(`StackNova route check passed: all ${requiredFiles.length} required route files exist.`);
