#!/usr/bin/env python3
"""Fetch MCP server metadata using raw GitHub only (no API rate limits)."""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "mcp-servers.json"

ALLOWED = {"MIT", "Apache-2.0", "BSD-3-Clause"}
MCP_ORG_AVATAR = "https://avatars.githubusercontent.com/u/182288589?v=4"

REPO_ENTRIES: list[tuple[str, str]] = [
    ("modelcontextprotocol/servers/tree/main/src/postgres", "PostgreSQL MCP"),
    ("modelcontextprotocol/servers/tree/main/src/sqlite", "SQLite MCP"),
    ("modelcontextprotocol/servers/tree/main/src/filesystem", "Filesystem MCP"),
    ("modelcontextprotocol/servers/tree/main/src/gdrive", "Google Drive MCP"),
    ("modelcontextprotocol/servers/tree/main/src/slack", "Slack MCP"),
    ("modelcontextprotocol/servers/tree/main/src/github", "GitHub MCP"),
    ("modelcontextprotocol/servers/tree/main/src/gitlab", "GitLab MCP"),
    ("modelcontextprotocol/servers/tree/main/src/puppeteer", "Puppeteer Automation MCP"),
    ("modelcontextprotocol/servers/tree/main/src/fetch", "Web Fetch MCP"),
    ("modelcontextprotocol/servers/tree/main/src/brave-search", "Brave Search MCP"),
    ("modelcontextprotocol/servers/tree/main/src/memory", "Knowledge Graph Memory MCP"),
    ("faulkj/legion-mcp", "Legion LLM Council MCP"),
    ("faulkj/fhirhydrant", "Healthcare FHIR MCP"),
    ("I4cTime/q-ring", "Agent Secrets Keyring MCP"),
    ("ctxfile/ctxfile", "Project Context Snapshot MCP"),
    ("seancrecord/scvd.store", "Agentic Commerce MCP"),
    ("BlazingCDN/blazingcdn-mcp", "CDN Management MCP"),
    ("astandrik/local-ydb-mcp", "Local YDB DB Ops MCP"),
    ("hypnosis/ssh-mcp", "OpenSSH Remote Exec MCP"),
    ("Jackalope-Dev/moxie-docs", "Codebase Documentation MCP"),
    ("mysleekdesigns/crawlforge-mcp", "Autonomous Scraper MCP"),
    ("amsultan2010/crosscode-cli", "Codebase Sync MCP"),
    ("themesic/perfex-crm-mcp", "CRM Integration MCP"),
    ("patsnap/patent-literature-search-mcp", "Patent & IP Search MCP"),
    ("ajprolific/waqi-privacy", "PII Redaction Privacy MCP"),
    ("Robinhill85/file2markdown-mcp", "Document Parsing MCP"),
    ("qdrant/mcp-server-qdrant", "Qdrant Vector DB MCP"),
    ("chroma-core/chroma-mcp", "Chroma Vector DB MCP"),
    ("milvus-io/mcp-server-milvus", "Milvus Search MCP"),
    ("clickhouse/mcp-server-clickhouse", "ClickHouse Analytics MCP"),
    ("redis/mcp-server-redis", "Redis In-Memory MCP"),
    ("elastic/mcp-server-elasticsearch", "Elasticsearch MCP"),
    ("stripe/agent-toolkit", "Stripe Payment & Invoicing MCP"),
    ("sentry-demos/mcp-server-sentry", "Sentry Error Triaging MCP"),
    ("docker/mcp-server-docker", "Docker Container Ops MCP"),
    ("kubernetes-sigs/mcp-server-kubernetes", "Kubernetes Cluster MCP"),
    ("hashicorp/mcp-server-vault", "Vault Secrets Manager MCP"),
    ("infisical/mcp-server-infisical", "Env Secrets Management MCP"),
    ("airtable/mcp-server-airtable", "Airtable Data Sync MCP"),
    ("notion-enhancer/mcp-server-notion", "Notion Knowledge MCP"),
    ("linear/mcp-server-linear", "Linear Issues & Tasks MCP"),
    ("atlassian/mcp-server-jira", "Jira Sprint & Tickets MCP"),
    ("atlassian/mcp-server-confluence", "Confluence Wiki MCP"),
    ("postmanlabs/mcp-server-postman", "API Testing & Mock MCP"),
    ("openapi-tools/mcp-server-openapi", "Dynamic OpenAPI Rest Adapter"),
    ("graphql/mcp-server-graphql", "GraphQL Schema & Query MCP"),
    ("hubspot/mcp-server-hubspot", "HubSpot CRM & Lead Ops MCP"),
    ("zendesk/mcp-server-zendesk", "Zendesk Support Ticket MCP"),
    ("chatwoot/mcp-server-chatwoot", "Omnichannel Customer Support MCP"),
    ("posthog/mcp-server-posthog", "Product Analytics & Replay MCP"),
    ("umami-software/mcp-server-umami", "Privacy Web Analytics MCP"),
    ("cloudflare/mcp-server-cloudflare", "DNS, WAF & Worker MCP"),
    ("aws-samples/mcp-server-cloudwatch", "AWS Logs & Alarm MCP"),
    ("pandas-dev/mcp-server-pandas", "CSV/Dataframe Analysis MCP"),
    ("apache/superset-mcp", "Superset BI & Dashboard MCP"),
    ("metabase/mcp-server-metabase", "Metabase SQL & Question MCP"),
    ("calcom/mcp-server-calcom", "Calendar & Meeting Booking MCP"),
    ("documenso/mcp-server-documenso", "Digital Signature Workflow MCP"),
    ("novuhq/mcp-server-novu", "Omnichannel Notification MCP"),
    ("livekit/mcp-server-livekit", "Real-time Audio/Video WebRTC MCP"),
    ("mattermost/mcp-server-mattermost", "Secure Team Chat MCP"),
    ("excalidraw/mcp-server-excalidraw", "Whiteboard & Diagram MCP"),
    ("stirling-tools/mcp-server-pdf", "PDF Manipulation & OCR MCP"),
    ("bytebase/mcp-server-bytebase", "Database Schema Migration MCP"),
    ("trivy-dev/mcp-server-trivy", "Vulnerability & Security Scanner MCP"),
    ("gitleaks/mcp-server-gitleaks", "Secret Leak Scanner MCP"),
    ("play-with-docker/mcp-server-portainer", "Container Management MCP"),
    ("kestra-io/mcp-server-kestra", "Event-driven Workflow MCP"),
    ("temporalio/mcp-server-temporal", "Resilient Code Workflow MCP"),
    ("activepieces/mcp-server-activepieces", "Automation & Integration MCP"),
    ("supabase/mcp-server-supabase", "Supabase DB, Auth & Functions MCP"),
    ("meilisearch/mcp-server-meilisearch", "Fast Search Engine MCP"),
    ("traefik/mcp-server-traefik", "Reverse Proxy & Routing MCP"),
    ("kong/mcp-server-kong", "API Gateway & Rate Limiting MCP"),
    ("openbao/mcp-server-openbao", "Secure Secret Storage MCP"),
    ("wazuh/mcp-server-wazuh", "SIEM & XDR Security MCP"),
    ("prometheus/mcp-server-prometheus", "Metrics & Alerting MCP"),
    ("uptime-kuma/mcp-server-uptime-kuma", "Status Page & Health MCP"),
    ("glitchtip/mcp-server-glitchtip", "Sentry-compatible Error MCP"),
    ("fluent/mcp-server-fluentd", "Log Collector & Forwarder MCP"),
    ("vectordotdev/mcp-server-vector", "High-perf Log Router MCP"),
    ("minio/mcp-server-minio", "S3 Object Storage MCP"),
    ("seaweedfs/mcp-server-seaweedfs", "Distributed File Store MCP"),
    ("zitadel/mcp-server-zitadel", "Identity & OIDC Auth MCP"),
    ("ory/mcp-server-kratos", "User Management & Auth MCP"),
    ("formbricks/mcp-server-formbricks", "In-app Survey & Feedback MCP"),
    ("bookstack/mcp-server-bookstack", "Corporate Wiki & SOP MCP"),
    ("affine-design/mcp-server-affine", "Knowledge Base & Notes MCP"),
    ("dubinc/mcp-server-dub", "Link Management & Attribution MCP"),
    ("litellm/mcp-server-litellm", "100+ LLM Gateway Proxy MCP"),
    ("knative/mcp-server-knative", "Serverless Container MCP"),
    ("opencost/mcp-server-opencost", "Kubernetes Cost Allocation MCP"),
    ("open-telemetry/mcp-server-otel", "Telemetry & Tracing MCP"),
    ("jaegertracing/mcp-server-jaeger", "Microservices Tracing MCP"),
    ("casbin/mcp-server-casbin", "RBAC/ABAC Access Control MCP"),
    ("fastlane/mcp-server-fastlane", "Mobile CI/CD Pipeline MCP"),
    ("open-policy-agent/mcp-server-opa", "Policy-as-Code Engine MCP"),
    ("dbt-labs/mcp-server-dbt", "Data Build Tool & Analytics MCP"),
    ("airflow/mcp-server-airflow", "Data Pipeline Scheduler MCP"),
    ("prefec-ai/mcp-server-prefect", "Python Workflow Orchestrator MCP"),
]

ALIASES: dict[str, tuple[str, str, str | None]] = {
    "supabase/mcp-server-supabase": ("supabase-community", "supabase-mcp", None),
    "linear/mcp-server-linear": ("linear", "linear-mcp-server", None),
    "metabase/mcp-server-metabase": ("metabase", "metabase-mcp-server", None),
    "prefec-ai/mcp-server-prefect": ("PrefectHQ", "prefect-mcp", None),
    "dbt-labs/mcp-server-dbt": ("dbt-labs", "dbt-mcp", None),
    "docker/mcp-server-docker": ("docker", "mcp", None),
    "posthog/mcp-server-posthog": ("PostHog", "posthog-mcp", None),
    "cloudflare/mcp-server-cloudflare": ("cloudflare", "mcp-server-cloudflare", None),
    "redis/mcp-server-redis": ("redis", "mcp-redis", None),
    "clickhouse/mcp-server-clickhouse": ("ClickHouse", "mcp-clickhouse", None),
    "github/github-mcp-server": ("github", "github-mcp-server", None),
}

TOOL_STOP = {
    "license", "guide", "configure", "verify", "macos", "windows", "linux", "the",
    "core", "network", "package", "name", "tool", "description", "for", "your",
    "use", "docker", "api", "basic", "authentication", "an", "a", "returns",
    "input", "information", "metadata", "store", "retrieve", "learn", "explore",
}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower())
    return s.strip("-") or "mcp-server"


def parse_ref(ref: str) -> tuple[str, str, str | None]:
    if ref in ALIASES:
        return ALIASES[ref]
    if "/tree/" in ref:
        owner_repo, rest = ref.split("/tree/", 1)
        subpath = rest.split("/", 1)[1] if "/" in rest else None
        owner, repo = owner_repo.split("/", 1)
        return owner, repo, subpath
    owner, repo = ref.split("/", 1)
    return owner, repo, None


def fetch_text(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "blacknook-mcp-fetcher/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status >= 400:
                return ""
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return ""


def license_from_text(text: str) -> str | None:
    t = text.lower()
    if "apache license" in t and "version 2" in t:
        return "Apache-2.0"
    if "mit license" in t or "permission is hereby granted, free of charge" in t:
        return "MIT"
    if "bsd 3-clause" in t:
        return "BSD-3-Clause"
    return None


def resolve_license(owner: str, repo: str, subpath: str | None) -> str | None:
    for branch in ("main", "master"):
        for path in ("LICENSE", "LICENSE.md", "LICENSE.txt"):
            lic = license_from_text(
                fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}")
            )
            if lic:
                return lic
        if subpath:
            pkg = fetch_text(
                f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{subpath}/package.json"
            )
            if pkg:
                try:
                    data = json.loads(pkg)
                    lic = str(data.get("license", "")).strip()
                    if lic.upper() == "MIT":
                        return "MIT"
                    if lic.lower() in ("apache-2.0", "apache 2.0"):
                        return "Apache-2.0"
                except json.JSONDecodeError:
                    pass
    return None


def fetch_readme(owner: str, repo: str, subpath: str | None) -> str:
    for branch in ("main", "master"):
        paths = [f"{subpath}/README.md"] if subpath else []
        paths += ["README.md", "readme.md"]
        for path in paths:
            text = fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}")
            if text and len(text) > 40:
                return text
    return ""


def clean_text(text: str) -> str:
    text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def extract_how_it_works(readme: str) -> str:
    text = clean_text(readme.replace("\r\n", "\n"))
    if not text:
        return "Model Context Protocol üzerinden yapay zeka ajanlarına güvenli araç ve veri erişimi sağlar."
    for pat in (r"##\s+Overview", r"##\s+How it works", r"##\s+About", r"##\s+Description"):
        m = re.search(pat + r"\s*\n+([\s\S]*?)(?:\n##|\Z)", text, re.I)
        if m:
            block = m.group(1).strip()
            paras = [p.strip() for p in block.split("\n\n") if len(p.strip()) > 40 and not p.startswith("#")]
            if paras:
                return paras[0][:900]
    paras = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50 and not p.startswith("#")]
    return (paras[0][:900] if paras else "MCP sunucusu; ajanlarınıza standart araç arayüzü sunar.")


def extract_tools(readme: str) -> list[str]:
    tools: list[str] = []
    for m in re.finditer(r"`([a-z][a-z0-9_]{2,})`", readme):
        t = m.group(1)
        if t.lower() not in TOOL_STOP:
            tools.append(t)
    for line in readme.splitlines():
        m = re.match(r"[-*]\s+`([a-z][a-z0-9_]{2,})`", line.strip(), re.I)
        if m and m.group(1).lower() not in TOOL_STOP:
            tools.append(m.group(1))
    seen: set[str] = set()
    out: list[str] = []
    for t in tools:
        k = t.lower()
        if k not in seen and k not in TOOL_STOP:
            seen.add(k)
            out.append(t)
    return out[:16] or ["connect", "query"]


def build_config(server_id: str, owner: str, repo: str, subpath: str | None, readme: str) -> dict:
    key = re.sub(r"[^a-zA-Z0-9_]", "_", server_id)[:40]
    if owner == "modelcontextprotocol" and repo == "servers" and subpath:
        pkg = subpath.split("/")[-1]
        pkg_name = f"@modelcontextprotocol/server-{pkg}"
        args = ["-y", pkg_name]
        if pkg == "postgres":
            args.append("postgresql://USER:PASSWORD@localhost:5432/DB")
        return {"mcpServers": {key: {"command": "npx", "args": args}}}
    npx = re.search(r"npx\s+-y\s+([@\w/.-]+)", readme)
    if npx:
        return {"mcpServers": {key: {"command": "npx", "args": ["-y", npx.group(1)]}}}
    return {"mcpServers": {key: {"command": "npx", "args": ["-y", f"{owner}/{repo}"]}}}


def avatar_url(owner: str) -> str:
    if owner.lower() == "modelcontextprotocol":
        return MCP_ORG_AVATAR
    return f"https://github.com/{owner}.png"


def placeholder_logo(name: str) -> str:
    return (
        "https://ui-avatars.com/api/?name="
        + urllib.parse.quote(name[:2].upper())
        + "&background=0f766e&color=fff&size=128&bold=true"
    )


def process(ref: str, display_name: str) -> dict | None:
    owner, repo, subpath = parse_ref(ref)
    repo_url = f"https://github.com/{owner}/{repo}"
    if subpath:
        repo_url += f"/tree/main/{subpath}"

    readme = fetch_readme(owner, repo, subpath)
    if not readme and owner != "modelcontextprotocol":
        print(f"SKIP missing readme: {ref}", file=sys.stderr)
        return None

    lic = resolve_license(owner, repo, subpath)
    if not lic or lic not in ALLOWED:
        print(f"SKIP license ({lic}): {ref}", file=sys.stderr)
        return None

    desc = display_name
    first_para = extract_how_it_works(readme)
    if first_para and first_para != "MCP sunucusu; ajanlarınıza standart araç arayüzü sunar.":
        desc = f"{display_name} — {first_para[:200]}"

    sid = slugify(display_name)
    return {
        "id": sid,
        "name": display_name,
        "repo": repo_url,
        "license": lic,
        "logoUrl": avatar_url(owner),
        "description": desc[:500],
        "howItWorks": first_para,
        "tools": extract_tools(readme),
        "configTemplate": build_config(sid, owner, repo, subpath, readme),
    }


def main() -> None:
    results: list[dict] = []
    seen: set[str] = set()

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(process, ref, name): ref for ref, name in REPO_ENTRIES}
        for fut in as_completed(futures):
            item = fut.result()
            if not item:
                continue
            if item["id"] in seen:
                item["id"] = f"{item['id']}-{len(seen)}"
            seen.add(item["id"])
            results.append(item)
            print(f"OK {item['id']}", file=sys.stderr)

    results.sort(key=lambda x: x["name"].lower())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(results)} entries to {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
