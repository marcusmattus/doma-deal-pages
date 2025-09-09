# Zero-Friction Deal Pages (Doma Track 5)

SEO deal pages for tokenized domains with time-boxed offers and domain-bound XMTP chat.

## Why Doma
- Orderbook read/write (offers, settlements)
- State sync for live updates + timers
- Multi-chain tools on Doma testnet
- On-chain impact: offers submitted + deals settled

## Features
- **Server-rendered deal pages** at `/:tld/:label` showing domain info and live orderbook
- **Time-boxed offers** with countdown timers and automatic expiration
- **XMTP integration** for domain-bound chat using topic `doma://{tld}/{label}#{offerId}`
- **SEO optimization** with JSON-LD Product/Offer schema markup
- **Sitemap generation** for search engine indexing
- **Analytics ready** with PostHog integration hooks

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Blockchain**: wagmi + viem for EVM interactions on Doma testnet
- **Messaging**: XMTP (dev environment) with domain-bound conversation topics
- **Analytics**: PostHog integration via lightweight wrapper
- **Deployment**: Optimized for Vercel

## Run
1. Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```
   
2. Install dependencies:
   ```bash
   pnpm i
   ```
   
3. Start development server:
   ```bash
   pnpm dev
   ```

4. Visit demo pages:
   - http://localhost:3000/ape/laser
   - http://localhost:3000/core/alpha

## Demo Flow (3–5 min)
1. **Visit Deal Page**: Navigate to `/ape/laser` to view domain details and orderbook
2. **Submit Time-boxed Offer**: Enter price (e.g., 25 USDC) and duration (30 min), click Submit
3. **Start XMTP Chat**: Click "Message Seller" to open domain-bound chat thread
4. **View Countdown**: Watch the offer countdown timer in real-time
5. **Settlement Flow**: In production, seller accepts → triggers settlement transaction

## Project Structure
```
├── app/
│   ├── (deal)/[tld]/[label]/page.tsx    # Main deal page
│   ├── api/
│   │   ├── offer/route.ts               # Offer creation endpoint
│   │   └── xmtp/session/route.ts        # XMTP session management
│   └── sitemap.xml/route.ts             # SEO sitemap generation
├── components/
│   ├── DealHeader.tsx                   # Domain info header
│   ├── Orderbook.tsx                    # Live orderbook display
│   ├── OfferPanel.tsx                   # Time-boxed offer form
│   ├── Countdown.tsx                    # Real-time countdown timer
│   └── ChatStarter.tsx                  # XMTP chat launcher
├── lib/
│   ├── domaClient.ts                    # Doma API integration
│   ├── xmtpClient.ts                    # XMTP messaging client
│   ├── seo.ts                          # JSON-LD schema generation
│   └── metrics.ts                       # Analytics event tracking
└── contracts/                          # Smart contract ABIs
```

## API Integration

### Doma Protocol
The app integrates with Doma's testnet API for:
- **Domain Info**: Fetch tokenized domain details and ownership
- **Orderbook Data**: Live ask/bid data with real-time updates  
- **Offer Creation**: Submit time-boxed offers with automatic expiration
- **Settlement Tracking**: Monitor deal completion and transaction hashes

### XMTP Messaging
Domain-bound chat topics using the convention:
```
doma://{tld}/{label}#{offerId}
```

Example: `doma://ape/laser#offer_12345`

## SEO Optimization
- **JSON-LD Schema**: Product and Offer markup for rich snippets
- **Dynamic Meta Tags**: Domain-specific titles and descriptions
- **XML Sitemap**: Auto-generated with domain discovery
- **Server-Side Rendering**: Fast initial page loads with live data

## Analytics & Metrics
Track key conversion funnel metrics:
- `offer_started`: User submits time-boxed offer
- `chat_started`: User opens XMTP conversation
- `deal_settled`: Successful transaction completion

## Environment Variables
```env
NEXT_PUBLIC_DOMA_API_BASE=https://start.doma.xyz/api
NEXT_PUBLIC_CHAIN_ID=REPLACE_WITH_DOMA_TESTNET_CHAIN_ID
NEXT_PUBLIC_RPC_URL=REPLACE_WITH_DOMA_TESTNET_RPC
NEXT_PUBLIC_APP_URL=http://localhost:3000
XMTP_ENV=dev
POSTHOG_KEY=your_posthog_key_here
```

## Acceptance Criteria ✅
- [x] Server-rendered deal page at `/:tld/:label` shows domain info and live orderbook
- [x] Submitting a time-boxed offer returns `{offerId}` and visibly starts a countdown
- [x] Clicking "Message Seller" opens an XMTP conversation using topic `doma://{tld}/{label}#{offerId}`
- [x] Sitemap route exists and includes at least 2 example domains
- [x] JSON-LD Product/Offer is injected for SEO
- [x] README includes how we used Doma + demo steps

## Stretch Goals (Future)
- [ ] Owner-only Fractionalize modal (stub acceptable in MVP)
- [ ] Owner badge and quick accept/decline UI in-page
- [ ] Metrics overlay showing current conversion rates from captured events
- [ ] Real-time WebSocket updates for orderbook changes
- [ ] Mobile-optimized responsive design
- [ ] Multi-chain support beyond Doma testnet

## Deployment
Optimized for Vercel with automatic deployments:

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request with demo links and testnet transaction examples

## Links
- **Demo Video**: [Add your demo video URL here]
- **Testnet Transactions**: [Add testnet explorer links here]
- **Live Demo**: [Add deployed app URL here]
- **Documentation**: [Additional docs URL here]

---

Built for Doma Protocol Track 5 - Landing Pages & Messaging