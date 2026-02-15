# CFX Status

Unofficial real-time status page for Cfx.re services. Monitors FiveM, RedM, Forum, Keymaster, Marketplace, and infrastructure. Built with TanStack Start and deployed on Cloudflare Workers.

> [!CAUTION]
> **DISCLAIMER:** This is an **unofficial** project and is **not affiliated** with Cfx.re, Rockstar Games, or Take-Two Interactive. All trademarks belong to their respective owners.

## Features

- Live service monitoring with real-time status probes
- Categorized services across 6 categories
- Per-service response times with color-coded indicators
- Auto-refresh every 5 minutes with manual refresh button
- Client-side fetching for instant page loads
- JSON API endpoint at `/api/status`
- Responsive dark-themed UI

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

Review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.

## Security

See [SECURITY.md](SECURITY.md) for security concerns. Do not open public issues for vulnerabilities.

## License

This project is licensed under the [GNU Affero General Public License v3](../LICENSE) (AGPL-3.0).

## Contact

- Email: [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev)
- GitHub: [CodeMeAPixel/cfxstat.us](https://github.com/CodeMeAPixel/cfxstat.us)
- Site: [https://cfxstat.us](https://cfxstat.us)

