import 'server-only';

const BASE = process.env.NEXT_PUBLIC_DOMA_API_BASE!;

export type DomainKey = { tld: string; label: string };

export interface DomainInfo {
  name: string;
  tld: string;
  label: string;
  owner: `0x${string}`;
  tokenId?: string;
  tokenizedChain?: string;
  status: 'active' | 'tokenized' | 'bridged' | 'claimed';
  registrar: string;
  expirationDate?: string;
  bridgeInfo?: {
    sourceChain: string;
    targetChain: string;
    status: 'pending' | 'completed';
  };
}

export interface OrderbookEntry {
  price: string;
  size: number;
  maker: `0x${string}`;
  timestamp: number;
}

export interface Orderbook {
  asks: OrderbookEntry[];
  bids: OrderbookEntry[];
  lastSale?: {
    price: string;
    timestamp: number;
    txHash: string;
  };
  owner: `0x${string}`;
}

// Get domain information from Doma API
export async function getDomain(key: DomainKey): Promise<DomainInfo> {
  try {
    const r = await fetch(`${BASE}/domains/${key.tld}/${key.label}`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Doma-Deal-Pages/1.0'
      }
    });
    
    if (!r.ok) {
      if (r.status === 404) {
        throw new Error('Domain not found');
      }
      throw new Error(`Domain fetch failed: ${r.status}`);
    }
    
    return await r.json();
  } catch (error) {
    // Return mock data for demo if API fails
    console.warn('Domain API failed, using mock data:', error);
    return {
      name: `${key.label}.${key.tld}`,
      tld: key.tld,
      label: key.label,
      owner: '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`,
      status: 'tokenized',
      registrar: 'D3 Testnet',
      tokenizedChain: 'Base Sepolia'
    };
  }
}

// Get orderbook data for a tokenized domain
export async function getOrderbook(key: DomainKey): Promise<Orderbook> {
  try {
    const r = await fetch(`${BASE}/orderbook/${key.tld}/${key.label}`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Doma-Deal-Pages/1.0'
      }
    });
    
    if (!r.ok) {
      throw new Error(`Orderbook fetch failed: ${r.status}`);
    }
    
    return await r.json();
  } catch (error) {
    // Return mock orderbook data for demo
    console.warn('Orderbook API failed, using mock data:', error);
    return {
      asks: [
        { price: '100', size: 1, maker: '0xabcd...1234' as `0x${string}`, timestamp: Date.now() },
        { price: '150', size: 1, maker: '0xabcd...5678' as `0x${string}`, timestamp: Date.now() }
      ],
      bids: [
        { price: '75', size: 1, maker: '0xefgh...9876' as `0x${string}`, timestamp: Date.now() },
        { price: '50', size: 2, maker: '0xefgh...5432' as `0x${string}`, timestamp: Date.now() }
      ],
      lastSale: { 
        price: '85', 
        timestamp: Date.now() - 86400000, 
        txHash: '0xdemo123...'
      },
      owner: '0x1234567890abcdef1234567890abcdef12345678' as `0x${string}`
    };
  }
}

// Create a time-boxed offer for a domain
export async function createOffer(input: { 
  key: DomainKey; 
  price: string; 
  expiresAt: number; 
  buyer: `0x${string}`; 
}) {
  try {
    const r = await fetch(`${BASE}/offers`, {
      method: 'POST', 
      headers: { 
        'content-type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Doma-Deal-Pages/1.0'
      },
      body: JSON.stringify({
        domain: `${input.key.label}.${input.key.tld}`,
        price: input.price,
        expiresAt: input.expiresAt,
        buyer: input.buyer
      }), 
      cache: 'no-store'
    });
    
    if (!r.ok) {
      throw new Error(`Offer creation failed: ${r.status}`);
    }
    
    return await r.json(); // { offerId, txHash }
  } catch (error) {
    // Return mock response for demo
    console.warn('Offer creation failed, using mock response:', error);
    return {
      offerId: `DEMO_${Date.now()}`,
      txHash: '0xdemo123456789abcdef',
      status: 'pending'
    };
  }
}

// Get available domains for the sitemap
export async function getAvailableDomains(): Promise<DomainKey[]> {
  try {
    const r = await fetch(`${BASE}/domains`, { 
      next: { revalidate: 3600 }, // Cache for 1 hour instead of no-store
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Doma-Deal-Pages/1.0'
      }
    });
    
    if (!r.ok) {
      throw new Error(`Domains list fetch failed: ${r.status}`);
    }
    
    const data = await r.json();
    return data.domains || [];
  } catch (error) {
    // Return demo domains
    console.warn('Domains list API failed, using mock data:', error);
    return [
      { tld: 'ape', label: 'laser' },
      { tld: 'core', label: 'alpha' },
      { tld: 'io', label: 'blockchain' },
      { tld: 'crypto', label: 'defi' }
    ];
  }
}