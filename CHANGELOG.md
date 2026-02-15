# Changelog

All notable changes to CFX Status will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-02-14

### Added

- **Incident Tracking System** — Automatically detects service status changes and maintains incident history with auto-resolution when services return to operational status
- **Incident History UI** — Tabbed interface showing recent incidents with timeline, impact level, and resolution status
- **RSS Feed** — `/api/status.rss` endpoint for subscribing to incident updates in RSS readers
- **RSS Autodiscovery** — Auto-detection link in HTML head for browsers and RSS readers (`rel="alternate" type="application/rss+xml"`)
- **Discord Webhooks** — Register Discord webhooks to receive instant notifications when incidents occur
- **Webhook Management UI** — Add, test, and manage Discord webhooks in the Subscribe tab with success/failure status tracking
- **Rate Limiting** — Per-webhook rate limits (5 tests/hour, 2/minute) with exponential backoff to prevent Discord API abuse
- **Intelligent Retry Logic** — Automatic retries with exponential backoff for transient failures; respects Discord's `Retry-After` header
- **Cloudflare KV Namespaces** — INCIDENTS and WEBHOOKS KV bindings configured in Wrangler for persistent storage
- **Subscribe Tab** — Consolidated subscription options (RSS, Email coming soon, Discord webhooks) with user-friendly UI

### Changed

- **Repository** — Migrated from `FixFXOSS/cfxstat.us` back to `CodeMeAPixel/cfxstat.us`
- **Branding** — Updated all documentation and references to reflect CodeMeAPixel ownership
- **Header Navigation** — Moved GitHub source link from footer to header for better visibility
- **Documentation** — Simplified and cleaned up README, CONTRIBUTING, DEPLOYMENT, SECURITY, and CODE_OF_CONDUCT files; removed unnecessary complexity
- **Category Cards** — Changed from open-by-default to closed-by-default for cleaner initial page state
- **Status Page Layout** — Reorganized with tabbed interface (Overview, Incidents, Subscribe) for better information hierarchy

## [0.1.1] - 2026-02-14

### Added

- **Custom Response Validators** — `ServiceEndpoint` now supports an optional `validateResponse(status, body)` callback for endpoints that return non-standard status codes
- **Lambda Monitor Fix** — Lambda endpoint uses a custom validator that checks for a valid `version` field in the JSON body, correctly reporting operational even when it returns HTTP 503
- **Rate Limiting & Backoff** — Exponential backoff (1s, 2s) with up to 2 retries on transient failures (5xx, timeouts, network errors)
- **429 Handling** — Respects `Retry-After` header on rate-limited responses, waits up to 30s before retrying
- **Concurrency Limiting** — Max 4 requests in flight at once to avoid hammering Cfx.re endpoints
- **Loading Skeleton** — Shows a spinner on first load instead of a blank page while services are checked

### Changed

- **Non-Blocking Page Load** — Removed SSR loader that blocked page render while checking all 22 endpoints; status is now fetched client-side on mount for instant page load
- **Auto-Refresh Interval** — Bumped from 60 seconds to 5 minutes
- **Request Timeout** — Increased from 8 seconds to 15 seconds per endpoint
- **API Cache Headers** — Changed from `max-age=30, s-maxage=30` to `max-age=120, s-maxage=300`
- **Domain** — Updated from `status.fixfx.wiki` to `cfxstat.us`
- **Repository** — Moved from `CodeMeAPixel/fixfx-status` to `CodeMeAPixel/cfxstat.us`
- **User-Agent** — Updated to `cfxstat.us/1.0 (status-checker)`

### Fixed

- **Lambda False Positive** — Lambda endpoint was incorrectly reported as degraded because it returns HTTP 503 with a valid JSON body containing version information

## [0.1.0] - 2026-02-14

### Added

- **Status Page** — Real-time monitoring dashboard for 22 Cfx.re service endpoints across 6 categories
- **Service Categories** — Core Platform, Game Services, Runtime & Builds, Content & Documentation, Authentication & APIs, Infrastructure
- **Overall Status Banner** — Aggregated status with glow effects and operational count
- **Service Category Cards** — Collapsible cards with per-service rows showing response time, HTTP status code, and status badge
- **Status Badges** — Colour-coded badges for operational, degraded, partial, major, and unknown states
- **Auto-Refresh** — Client-side polling with manual refresh button
- **JSON API** — `/api/status` endpoint returning full status summary with cache headers
- **Background Effects** — Mouse-tracking glow orbs, grid overlay, and noise texture
- **Responsive Design** — Dark-themed glassmorphic UI optimised for all screen sizes
- **Cloudflare Workers Deployment** — Configured via Wrangler with custom domain routing
