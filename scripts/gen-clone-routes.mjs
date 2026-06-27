#!/usr/bin/env node
/**
 * Generate clone-routes-data.js from molar-clones fixtures + agent-critical.json.
 * Run from molar.it: node scripts/gen-clone-routes.mjs
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");
const clonesRepo = (() => {
  if (process.env.MOLAR_CLONES_DIR) return resolve(process.env.MOLAR_CLONES_DIR);
  for (const candidate of [
    resolve(siteRoot, "..", "molar-clones"),
    resolve(siteRoot, "molar-clones"),
  ]) {
    if (existsSync(join(candidate, "fixtures", "agent-critical.json"))) return candidate;
  }
  throw new Error("molar-clones not found — set MOLAR_CLONES_DIR");
})();

const agentCritical = JSON.parse(
  readFileSync(join(clonesRepo, "fixtures", "agent-critical.json"), "utf8"),
);

const RESOURCE_HINTS = [
  "workflowstates", "workflow", "organizations", "organization", "initiatives", "initiative",
  "projects", "project", "issues", "issue", "comments", "comment", "cycles", "cycle",
  "teams", "team", "users", "user", "labels", "label", "relations", "relation",
  "repositories", "repository", "pulls", "pull", "branches", "branch", "commits", "commit",
  "collections", "collection", "sites", "site", "pages", "page", "releases", "release",
  "bookings", "booking", "guests", "guest", "properties", "property", "listings", "listing",
  "messages", "message", "actors", "actor", "datasets", "dataset", "stores", "store",
  "pipelines", "pipeline", "merge_requests", "inquiries", "inquiry", "coupons", "coupon",
  "orders", "order", "products", "product", "customers", "customer", "forms", "form",
  "webhooks", "webhook", "assets", "asset", "contacts", "contact", "deals", "deal",
  "events", "event", "calendars", "calendar", "emails", "email", "threads", "thread",
];

function titleCase(s) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function pluralGroup(hint) {
  const base = hint.replace(/s$/, "");
  return titleCase(base.endsWith("s") ? hint : `${base}s`);
}

function groupFromFixtureName(filename) {
  const tokens = filename.replace(/\.json$/, "").split("-");
  for (const hint of RESOURCE_HINTS) {
    if (tokens.includes(hint)) return pluralGroup(hint);
  }
  if (tokens[0] === "chat" || tokens.join("-").includes("postmessage")) return "Messaging";
  if (tokens[0] === "conversations") return "Conversations";
  if (tokens[0] === "reactions") return "Reactions";
  return titleCase(tokens.slice(1).join(" ") || tokens[0] || "General");
}

function fixtureToTool(filename) {
  return filename.replace(/\.json$/, "").replace(/-/g, "_");
}

function fixtureToDesc(filename) {
  const words = filename.replace(/\.json$/, "").split("-").join(" ");
  return `${words.charAt(0).toUpperCase()}${words.slice(1)} (recorded fixture).`;
}

function groupFromRoute(path) {
  const clean = path.split("?")[0];
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return "General";
  if (parts[0].includes(".")) {
    const [ns, action] = parts[0].split(".");
    return titleCase(ns || action || "API");
  }
  const vIdx = parts.findIndex((p) => /^v\d+$/.test(p));
  const seg = vIdx >= 0 ? parts[vIdx + 1] : parts[0];
  if (!seg) return "General";
  for (const hint of RESOURCE_HINTS) {
    if (seg.toLowerCase().includes(hint.replace(/s$/, ""))) return pluralGroup(hint);
  }
  return titleCase(seg);
}

function routeToTool(method, path) {
  return `${method} ${path}`;
}

function listFixtureOps(cloneId) {
  const dir = join(clonesRepo, "fixtures", cloneId);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "package.json")
    .filter((f) => !existsSync(join(dir, "seeds", f)))
    .sort();
}

function buildToolGroups(cloneId) {
  const groups = new Map();
  const add = (groupTitle, tool, desc) => {
    if (!groups.has(groupTitle)) groups.set(groupTitle, []);
    const list = groups.get(groupTitle);
    if (list.some(([t]) => t === tool)) return;
    list.push([tool, desc]);
  };

  const fixtures = listFixtureOps(cloneId);

  if (fixtures.length > 0) {
    for (const file of fixtures) {
      add(groupFromFixtureName(file), fixtureToTool(file), fixtureToDesc(file));
    }
  } else {
    const routes = agentCritical[cloneId] || [];
    for (const row of routes) {
      const { method, path } = row;
      if (!method || !path) continue;
      add(groupFromRoute(path), routeToTool(method, path), "Recorded REST route with vendor-shaped errors.");
    }
  }

  const groupOrder = [...groups.keys()].sort((a, b) => {
    if (a === "General") return 1;
    if (b === "General") return -1;
    return a.localeCompare(b);
  });

  return groupOrder.map((title) => ({
    title,
    tools: groups.get(title).sort((a, b) => a[0].localeCompare(b[0])),
  }));
}

const fixtureDirs = readdirSync(join(clonesRepo, "fixtures"))
  .filter((name) => existsSync(join(clonesRepo, "fixtures", name)) && agentCritical[name]);

const out = {};
let totalOps = 0;
for (const id of fixtureDirs.sort()) {
  const toolGroups = buildToolGroups(id);
  const ops = toolGroups.reduce((n, g) => n + g.tools.length, 0);
  if (ops > 0) {
    out[id] = toolGroups;
    totalOps += ops;
  }
}

const header = `// GENERATED by scripts/gen-clone-routes.mjs — do not edit by hand.
// Source: molar-clones/fixtures/{id}/*.json + agent-critical.json
// Regenerate: node scripts/gen-clone-routes.mjs
window.CLONE_ROUTE_GROUPS = `;

writeFileSync(join(siteRoot, "clone-routes-data.js"), `${header}${JSON.stringify(out, null, 2)};\n`, "utf8");

const counts = Object.fromEntries(
  Object.entries(out).map(([k, g]) => [k, g.reduce((n, gr) => n + gr.tools.length, 0)]),
);
console.log(`Wrote clone-routes-data.js — ${Object.keys(out).length} clones, ${totalOps} ops`);
console.log(counts.linear ? `  linear: ${counts.linear} ops` : "");
