import { getDomain, getOrderbook } from '@/lib/domaClient';
import DealHeader from '@/components/DealHeader';
import Orderbook from '@/components/Orderbook';
import OfferPanel from '@/components/OfferPanel';
import ChatStarter from '@/components/ChatStarter';
import { buildJsonLd } from '@/lib/seo';
import { Metadata } from 'next';

export const revalidate = 60;

interface PageProps {
  params: { tld: string; label: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const domainName = `${params.label}.${params.tld}`;
  
  return {
    title: `${domainName} - Tokenized Domain Deal Page | Doma Protocol`,
    description: `View live orderbook, submit time-boxed offers, and start XMTP chat for ${domainName}. Built on Doma Protocol for zero-friction domain trading.`,
    openGraph: {
      title: `${domainName} - Domain Deal Page`,
      description: `Premium tokenized domain ${domainName} available for trading with time-boxed offers and secure messaging.`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.tld}/${params.label}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${domainName} - Tokenized Domain`,
      description: `Trade ${domainName} with time-boxed offers on Doma Protocol`,
    },
    keywords: [
      'domain trading',
      'tokenized domains',
      'Doma Protocol',
      'XMTP messaging',
      'blockchain domains',
      params.tld,
      params.label,
      domainName
    ],
  };
}

export default async function Page({ params }: PageProps) {
  const key = { tld: params.tld, label: params.label };
  
  // Fetch domain and orderbook data
  const [domain, ob] = await Promise.all([
    getDomain(key), 
    getOrderbook(key)
  ]);
  
  // Generate SEO JSON-LD structured data
  const jsonLd = buildJsonLd({ 
    name: domain.name, 
    price: ob.asks?.[0]?.price, 
    availability: ob.asks?.length ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' 
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Structured Data */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />
      
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition-colors">
              Home
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-400">{params.tld}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-gray-900">{params.label}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Domain Info & Orderbook */}
          <div className="lg:col-span-2 space-y-6">
            <DealHeader 
              domain={domain} 
              lastSale={ob.lastSale} 
              owner={ob.owner} 
            />
            <Orderbook asks={ob.asks} bids={ob.bids} />
          </div>

          {/* Right Column - Offers & Chat */}
          <div className="space-y-6">
            <OfferPanel domainKey={key} />
            <ChatStarter domainKey={key} />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About This Domain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Domain Details</h3>
              <div className="space-y-1 text-gray-600">
                <div>Name: <span className="font-mono">{domain.name}</span></div>
                <div>TLD: <span className="font-medium">.{domain.tld}</span></div>
                <div>Status: <span className="capitalize">{domain.status}</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tokenization</h3>
              <div className="space-y-1 text-gray-600">
                <div>Registrar: {domain.registrar}</div>
                {domain.tokenizedChain && (
                  <div>Chain: {domain.tokenizedChain}</div>
                )}
                <div>Protocol: Doma</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Trading Info</h3>
              <div className="space-y-1 text-gray-600">
                <div>Active Asks: {ob.asks.length}</div>
                <div>Active Bids: {ob.bids.length}</div>
                {ob.lastSale && (
                  <div>Last Sale: ${ob.lastSale.price} USDC</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How Domain Trading Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Submit Offer</h3>
              <p className="text-gray-600 text-sm">Create a time-boxed offer with your desired price and expiration time</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Chat</h3>
              <p className="text-gray-600 text-sm">Message the seller using XMTP for secure, domain-bound conversations</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete Deal</h3>
              <p className="text-gray-600 text-sm">Negotiate and settle the transaction on-chain through Doma Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}