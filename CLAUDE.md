# DiversiFi v1-interface

## Stack
React 19 + TypeScript 5.7 + Vite 6 | Wagmi 2 + Viem + ConnectKit | TanStack Query 5 + Redux Toolkit + URQL | TailwindCSS 3 + Radix UI | React Router v7 | pnpm

## Source Tree

```
src/
├── App.tsx              # Router + lazy page imports + responsive layout switch
├── main.tsx             # Provider nesting order (see Providers below)
├── pages/
│   ├── Pool/            # Main DeFi UI — Swap/Mint/Burn via dialogs, asset cards, charts
│   ├── Account/         # Settings: theme toggle, language
│   ├── Rewards/         # Merkl rewards claim interface
│   ├── Terms/           # Legal pages
│   └── Blocked.tsx      # Geo-compliance block
├── components/
│   ├── ui/              # Radix UI wrappers: Button, Dialog, Tabs, Tooltip, Popover, etc.
│   ├── AppSidebar/      # Desktop sidebar nav
│   └── Navbar/          # Mobile/tablet top nav
├── layouts/             # RootLayout (navbar+footer) | SidebarLayout | SingleColumnLayout
├── hooks/
│   ├── BackingPool/     # usePoolReserves, useAssets, mintHook, burnHook, swapHook
│   ├── MerklHooks/      # useCampaigns — Merkl rewards data
│   └── UniswapGraphHooks/
├── lib/
│   ├── numbers.ts       # formatNumber(), BigNumber helpers
│   ├── queryClient.ts   # React Query client (10s staleTime/refetchInterval)
│   ├── uniswapUtils.ts  # Uniswap V4 quote/swap helpers
│   └── merkl.ts         # Merkl API helpers
├── constants/
│   ├── tokens.ts        # SUPPORTED_RESERVE_ASSETS, BACKED_TOKEN, token addresses
│   ├── contracts.ts     # Contract addresses keyed by chainId
│   ├── chain.ts         # Chain config: mainnet(1), sepolia(11155111), hardhat(31337)
│   ├── routes.ts        # PageRoutes + TermsRoutes enums
│   └── environment.ts   # EnvVar class — validates VITE_ env vars, exposes chainId
├── state/               # Redux: theme + formSettings slices, persisted to localStorage
├── providers/           # Context providers (see Providers below)
├── abi/                 # Contract ABIs: IBackingPool, UniswapV4Router/Quoter, Permit2
├── icons/               # SVG icon components
└── styles/              # index.css (Tailwind + HSL CSS vars), reset.css, fonts.css
```

## Providers (nesting order in main.tsx)
`Redux` → `PersistGate` → `ThemeProvider` → `Web3Provider` (Wagmi + QueryClient + ConnectKit) → `ChainProvider` (auto-switch to default chain) → `ComplianceProvider` (geo-block) → `BrowserRouter`

## Networking

| Layer | Tool | Pattern |
|-------|------|---------|
| On-chain reads | `useReadContract` / `useReadContracts` (Wagmi) | 10s staleTime + 10s refetchInterval |
| REST | `useQuery` (React Query) | ETH price from AWS API Gateway |
| GraphQL | URQL client | Uniswap subgraph |
| Merkl | `@merkl/api` SDK | React Query hooks in `hooks/MerklHooks/` |

All fetching is abstracted into hooks returning `{ data, isLoading, isError, isFetching }`.

## Routing
- React Router v7 with `lazy()` + `Suspense` (per-page code splitting)
- Layout: desktop → `SidebarLayout`; tablet/mobile (`< 1024px`) → `RootLayout`
- Route enums in `src/constants/routes.ts`
- Main routes: `/` Pool/Swap · `/account` · `/rewards` · `/blocked` · `/terms/*`

## Self-Improvement Rules
- When the user overrides a suggested edit, appends corrections, or rejects an approach — update this file immediately with the design decision and reasoning. Apply that decision in all future edits without being asked again.
- After any feature change, update the relevant section(s) of this file to reflect the current state. This file should always describe how the app actually works, not how it used to work.

## Key Conventions
- **Multi-chain maps**: all addresses/tokens typed as `Record<chainId, ...>` — supports 1, 11155111, 31337
- **Financial math**: BigNumber.js everywhere; display via `formatNumber()` in `lib/numbers.ts`
- **Class merging**: `cn()` = clsx + tailwind-merge; custom Tailwind utilities: `row`, `column`, `stack`, `flexCenter`
- **Theming**: HSL CSS vars in `styles/index.css` (`:root` / `.dark`); Redux `theme` slice + `next-themes`
- **Breakpoints**: `useBreakpoints()` — `isMobile` <640px, `isTablet` <1024px, `isDesktop` ≥1024px
- **Env vars**: access via `envVar` instance from `constants/environment.ts` (not `import.meta.env` directly)
