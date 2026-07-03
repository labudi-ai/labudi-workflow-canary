import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const REPO_NAME = "@sickr/workflow-canary";

test("health script reports canary status with repo and ISO timestamp", async () => {
  const [{ stdout }, { stdout: gitMode }, readmeText] = await Promise.all([
    execFileAsync("bash", ["scripts/health.sh"]),
    execFileAsync("git", ["ls-files", "--stage", "scripts/health.sh"]),
    readFile("README.md", "utf8"),
  ]);

  assert.match(gitMode, /^100755 /);
  assert.match(stdout.trim(), new RegExp(`^canary ${REPO_NAME.replace("/", "\\/")} \\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`));
  assert.match(readmeText, /## Health check/);
  assert.match(readmeText, /scripts\/health\.sh/);
});
