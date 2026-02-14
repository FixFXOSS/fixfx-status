# CFX Status

Unofficial real-time status page for Cfx.re services — monitors FiveM, RedM, Forum, Keymaster, Marketplace, and related infrastructure. Built with TanStack Start and deployed on Cloudflare Workers.

[![Build status](https://github.com/FixFXOSS/cfxstat.us/actions/workflows/test-build.yml/badge.svg)](https://github.com/FixFXOSS/cfxstat.us/actions)
[![Lint status](https://github.com/FixFXOSS/cfxstat.us/actions/workflows/validate-linting.yml/badge.svg)](https://github.com/FixFXOSS/cfxstat.us/actions)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![Deployed on Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com/)

## Features

- **Live Service Monitoring**: Probes Cfx.re endpoints and reports status in real time
- **Categorised Services**: Core Platform, Game Services, Runtime & Builds, Marketplace, Auth & APIs
- **Response Times**: Per-service latency with colour-coded indicators
- **Auto Refresh**: Client auto-refreshes every 5 minutes, manual refresh button available
- **Client-Side Fetching**: Status is fetched on the client for instant page load with loading skeleton
- **API Endpoint**: `/api/status` returns JSON for programmatic consumption
- **Responsive Design**: Dark-themed glassmorphic UI optimised for all screen sizes

## Getting Started

Install dependencies:

```bash
bun install
```

Start development server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

## Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── index.tsx        # Main status dashboard
│   └── api/
│       └── status.ts    # JSON API endpoint
├── components/
│   ├── layouts/         # Page layouts (StatusPageLayout)
│   ├── ui/              # StatusBadge, OverallBanner, ServiceCategoryCard, BackgroundEffects
│   ├── StatusHeader.tsx
│   └── StatusFooter.tsx
├── data/
│   └── services.ts      # Monitored endpoints configuration
├── types/
│   └── status.ts        # TypeScript interfaces
├── utils/
│   ├── status-checker.ts # Health-check logic
│   └── cn.ts            # Class name utility
└── styles.css           # Global Tailwind CSS styles
```

## Adding / Editing Services

Edit `src/data/services.ts` to add or modify monitored endpoints:

```typescript
{
  id: "my-service",
  name: "My Service",
  url: "https://example.com/health",
  description: "Optional description",
  method: "GET",              // GET | HEAD | POST (default: GET)
  expectedStatus: 200,        // default: 200
  acceptRange: false,         // accept any 2xx/3xx (default: false)
  validateResponse: (status, body) => {  // custom validation (optional)
    const json = JSON.parse(body);
    return json.status === "ok";
  },
}
```

## Deployment

This project is configured for deployment on Cloudflare Workers.

### Prerequisites

- Cloudflare account with Workers enabled
- Wrangler CLI installed: `npm install -g wrangler`

### Deploy

```bash
wrangler login
bun run deploy
```

The site will be available at `https://cfxstat.us`.

## Technology Stack

- **Framework**: TanStack Start with React 19
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite with TanStack Start plugin
- **Deployment**: Cloudflare Workers
- **Utilities**: clsx, tailwind-merge

## Disclaimer

This is an **unofficial** project and is **not affiliated** with Cfx.re, Rockstar Games, or Take-Two Interactive. All trademarks belong to their respective owners.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md). **Do not** open public issues for security vulnerabilities.

## License

This project is licensed under the [GNU Affero General Public License v3](../LICENSE) (AGPL-3.0).

## Contact

- **Email**: [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev)
- **GitHub**: [FixFXOSS/cfxstat.us](https://github.com/FixFXOSS/cfxstat.us)
- **Site**: [https://cfxstat.us](https://cfxstat.us)

