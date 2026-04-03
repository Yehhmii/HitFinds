# HitFinds — Frontend Assessment

A production-quality movie discovery app built with Next.js 15, TypeScript, and deployed on Cloudflare Workers via OpenNext.

## Quick Start

```bash
git clone https://github.com/yehhmii/frontend-assessment-francisco
cd frontend-assessment-francisco
npm install
cp .env.example .env.local   # add your TMDB keys from ur dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules
- **Data fetching**: Native fetch (server) + TanStack Query (client)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Cloudflare Workers via OpenNext

## Architecture Decisions

### Feature-based folder structure
Components are split into `ui/` (primitives: Card, Skeleton, Breadcrumb, EmptyState) and `features/` (domain-aware: MovieGrid, SearchInput, FilterBar, Pagination, CastSection). This separation keeps generic components reusable and feature components co-located with their business logic.

### API abstraction via `lib/api.ts`
All TMDB fetch calls live in one module. Components never call `fetch()` directly. This makes it easy to swap the data source, add caching, or mock in tests without touching component code.

### Server components for initial data, TanStack Query for interactivity
The listing page fetches initial data as a Server Component (SSR, cached for 1 hour). When the user searches or filters, TanStack Query takes over on the client and calls `/api/movies` — a Next.js edge route that proxies TMDB. This gives us fast initial page loads with SSR and snappy interactive updates without full page reloads.

### URL-driven search and filter state
Search query, genre, year, and page are all reflected in the URL via `useSearchParams`. This makes every result shareable and bookmarkable, and means browser back/forward works correctly.

### Pagination over infinite scroll
Pagination was chosen over infinite scroll because:
1. URL state is trivial — just a `page` param
2. Users can share or bookmark a specific page of results
3. Better for accessibility — users know exactly where they are
4. Simpler to implement correctly with SSR

### CSS Modules over Tailwind utilities
Although Tailwind is installed, CSS Modules were used for all component styling. This gives full control over the design system, keeps styles co-located with components, and avoids className bloat in JSX.

## Performance Optimizations

### 1. `next/image` with explicit dimensions and priority
All images use `next/image` with `fill` + `sizes` for responsive loading. Above-the-fold images (first 4 cards on listing, backdrop and poster on detail) use `priority` to trigger eager loading and avoid LCP penalties.

### 2. Next.js fetch cache settings
- `getPopularMovies` / `discoverMovies`: `revalidate: 3600` — popular movies don't change minute-to-minute; 1-hour ISR is a good trade-off between freshness and cache efficiency
- `searchMovies`: `no-store` — search results must always be fresh
- `getMovieDetail` / `getMovieCredits`: `revalidate: 86400` — movie metadata is stable; 24-hour cache is appropriate
- `/api/movies` route: `Cache-Control: public, s-maxage=3600` for discover, `no-store` for search

### 3. React Suspense streaming (Bonus B-2)
The cast section on the detail page is wrapped in a Suspense boundary. It's an async Server Component that fetches independently of the main movie data. Next.js streams the shell immediately and the cast arrives as soon as its fetch completes — no client-side loading state needed.

### 4. Edge runtime for API routes
`/api/movies` uses `export const runtime = "edge"` for minimal cold start latency on Cloudflare Workers.

### 5. Route-level code splitting
MovieGrid is a client component imported at the route level — Next.js handles code splitting automatically per route.

## Cloudflare Workers Deployment

This app is deployed via the OpenNext Cloudflare adapter which maps Next.js App Router semantics to the Workers runtime.

**Why Cloudflare over Vercel:**
Cloudflare Workers runs at the edge in 300+ locations globally with near-zero cold starts. For a content-heavy app like this, edge rendering means lower TTFB for users worldwide. It also matches the production stack at Checkit.

**OpenNext mapping of Next.js cache semantics:**
| Next.js option | Workers behavior |
|---|---|
| `revalidate: N` | Background revalidation via Workers Cache API with `max-age=N` |
| `force-cache` | Served from cache indefinitely until manual purge |
| `no-store` | Always fetches fresh, no caching |

**Deploy:**
```bash
npm run deploy
```

**Preview locally:**
```bash
npm run preview
```

## Trade-offs & Known Limitations

- **No optimistic updates**: Search results wait for the API response. With more time, I'd add optimistic UI using TanStack Query's `placeholderData`.
- **Cast images**: Some cast members have no profile photo; the fallback SVG is intentionally minimal. A proper silhouette illustration would be better.
- **TMDB rate limits**: The free TMDB API has rate limits. In production, responses should be cached more aggressively at the CDN level.
- **No persistent search history**: With more time, I'd store recent searches in localStorage for quick re-access.

## Bonus Tasks

### B-2: React Suspense Streaming 
The `CastSection` component on `/movies/[id]` is an async Server Component wrapped in `<Suspense fallback={<CastSkeleton />}>`. Next.js streams the page shell immediately while the cast fetch completes independently.

### B-3: Accessibility 
- All images have meaningful `alt` text (empty string for decorative backdrop)
- Breadcrumb uses `<nav aria-label="Breadcrumb">` with `aria-current="page"`
- Pagination uses `aria-label` on all buttons and `aria-current="page"` on active page
- EmptyState uses `role="status"`
- Search input uses `aria-label`
- Color contrast meets WCAG AA throughout

## Testing

```bash
npm run test
npm run test:coverage
```

Two components are fully covered:
- `EmptyState` — renders title, description, optional action link, correct ARIA role
- `SearchInput` — renders input, updates on change, shows/hides clear button, clears on click
