# Setup Instructions

This application now includes real authentication with Privy.io and XMTP messaging. Follow these steps to get it running:

## 1. Privy.io Setup

1. Go to [Privy.io](https://privy.io) and create an account
2. Create a new app in the Privy dashboard
3. Copy your App ID and App Secret
4. Update your `.env.local` file:

```bash
# Replace with your actual Privy credentials
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
PRIVY_APP_SECRET=your-privy-app-secret-here
```

## 2. Privy Configuration

In your Privy dashboard, configure:

- **Allowed Domains**: Add `localhost:3000` and your production domain
- **Login Methods**: Enable wallet, email, and SMS login
- **Supported Chains**: Add Base Sepolia (Chain ID: 84532)
- **Embedded Wallets**: Enable for users without wallets

## 3. XMTP Setup

XMTP is configured to use the dev environment by default. The environment can be changed in `.env.local`:

```bash
XMTP_ENV=dev  # or 'production' for mainnet
```

## 4. Dependencies Installation

If you encounter issues with package installation, try:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Or use yarn
yarn install
```

## 5. Running the Application

```bash
npm run dev
# or
yarn dev
```

## Key Features Now Available:

### Authentication
- ✅ Wallet connection via Privy.io
- ✅ Email/SMS login options
- ✅ Embedded wallet creation
- ✅ Base Sepolia network support

### Real XMTP Chat
- ✅ Wallet-to-wallet messaging
- ✅ Real-time message streaming  
- ✅ Domain-specific conversations
- ✅ Quick offer buttons

### Doma Integration
- ✅ Real domain data from Doma API
- ✅ On-chain offer creation
- ✅ Orderbook data display
- ✅ Transaction hash tracking

## Troubleshooting

### Common Issues:

1. **Privy Not Loading**: Check that your App ID is correct in `.env.local`
2. **XMTP Init Fails**: Ensure wallet is connected and on Base Sepolia
3. **Chat Not Working**: Both users need XMTP enabled wallets
4. **API Errors**: Check Doma API endpoints are accessible

### Testing Flow:

1. Connect wallet on homepage
2. Navigate to a domain page (e.g., `/ape/laser`)
3. Create an offer with your connected wallet
4. Start XMTP chat with domain owner
5. Send messages and offers in real-time

## Environment Variables

Complete `.env.local` template:

```bash
NEXT_PUBLIC_DOMA_API_BASE=https://api-testnet.doma.xyz/api/v1
NEXT_PUBLIC_DOMA_DASHBOARD_URL=https://dashboard-testnet.doma.xyz
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_APP_URL=http://localhost:3000
XMTP_ENV=dev
POSTHOG_KEY=

# Privy Configuration - REQUIRED
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
PRIVY_APP_SECRET=your-privy-app-secret-here
```

## Next Steps

- Set up your Privy.io account and get credentials
- Test the authentication flow
- Try creating offers and chatting
- Deploy to production with proper environment variables