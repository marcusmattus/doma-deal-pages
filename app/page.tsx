'use client';

import { usePrivy } from '@privy-io/react-auth';
import DomainSearch from '@/components/DomainSearch';
import LiveMarketplaceFeed from '@/components/LiveMarketplaceFeed';
import AuthButton from '@/components/AuthButton';

export default function HomePage() {
  const { authenticated, ready } = usePrivy();
  const dashboardUrl = process.env.NEXT_PUBLIC_DOMA_DASHBOARD_URL;

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Doma Marketplace</h3>
          <p className="text-gray-600">Initializing your Web3 experience...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section - Wallet Connection Focus */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234F46E5" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className="text-center animate-fade-in-up">
              {/* Logo and Title */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-float animate-pulse-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-5xl md:text-7xl font-bold gradient-text animate-bounce-subtle">
                    Doma
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">Domain Marketplace</p>
                </div>
              </div>
              
              {/* Main Value Proposition */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Trade Premium Domains with 
                <span className="gradient-text"> Real-Time Chat</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                Connect your wallet to access live domain negotiations, instant messaging with sellers, and secure on-chain transactions.
              </p>

              {/* Primary CTA - Connect Wallet */}
              <div className="mb-12">
                <AuthButton />
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center p-6 glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 text-sm">Direct XMTP messaging with domain owners for instant negotiations</p>
                </div>

                <div className="text-center p-6 glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Boxed Offers</h3>
                  <p className="text-gray-600 text-sm">Create urgency with automatic offer expiration timers</p>
                </div>

                <div className="text-center p-6 glass-morphism rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Transactions</h3>
                  <p className="text-gray-600 text-sm">On-chain deals powered by Doma Protocol on Base</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 pt-8 border-t border-gray-200/50">
                <p className="text-sm text-gray-500 mb-4">Trusted by domain traders worldwide</p>
                <div className="flex items-center justify-center gap-8 text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">XMTP Protocol</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Base Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Doma Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user experience
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header for authenticated users */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Doma Marketplace
              </h1>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main marketplace content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome back section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Live Marketplace</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Search for domains, view live negotiations, and start chatting with sellers instantly
          </p>
          <DomainSearch />
        </div>

        {/* Marketplace sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured domains */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Domains</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold">🔥</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">laser.ape</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Tokenized
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Premium domain with active orderbook and trading history</p>
                <a 
                  href="/ape/laser" 
                  className="group inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 gap-2 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Start Negotiating
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">alpha.core</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">Tech domain perfect for blockchain projects and DeFi protocols</p>
                <a 
                  href="/core/alpha" 
                  className="group inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 gap-2 transform hover:scale-105"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Start Negotiating
                </a>
              </div>
            </div>
          </div>

          {/* Live activity feed */}
          <div>
            <LiveMarketplaceFeed />
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Trade Domains</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Find a Domain</h4>
              <p className="text-gray-600 text-sm">Search or browse featured domains to find your perfect match</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Make an Offer</h4>
              <p className="text-gray-600 text-sm">Create a time-boxed on-chain offer with your desired price</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Start Chatting</h4>
              <p className="text-gray-600 text-sm">Use XMTP to negotiate directly with the domain owner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Doma Marketplace</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Live marketplace for tokenized domains built on Doma Protocol.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Powered by Doma Protocol</span>
                <span>•</span>
                <span>XMTP Messaging</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Protocol</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="https://doma.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white">Doma Protocol</a></div>
                <div><a href="https://testnet.d3.app" target="_blank" rel="noopener noreferrer" className="hover:text-white">D3 Testnet</a></div>
                {dashboardUrl && (
                  <div><a href={dashboardUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Dashboard</a></div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><a href="https://xmtp.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">XMTP Protocol</a></div>
                <div><a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-white">Base Network</a></div>
                <div><a href="https://privy.io" target="_blank" rel="noopener noreferrer" className="hover:text-white">Privy Auth</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Doma Marketplace. Built for live domain trading.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}