'use client';

import { useState, useEffect } from 'react';

interface MarketplaceActivity {
  id: string;
  type: 'offer' | 'chat' | 'sale';
  domain: string;
  amount?: string;
  timestamp: number;
  status: 'active' | 'completed' | 'expired';
}

// Mock data for demonstration - in real app this would come from API
const mockActivities: MarketplaceActivity[] = [
  {
    id: '1',
    type: 'offer',
    domain: 'laser.ape',
    amount: '25,000',
    timestamp: Date.now() - 120000, // 2 minutes ago
    status: 'active'
  },
  {
    id: '2',
    type: 'chat',
    domain: 'alpha.core',
    timestamp: Date.now() - 300000, // 5 minutes ago
    status: 'active'
  },
  {
    id: '3',
    type: 'offer',
    domain: 'crypto.eth',
    amount: '150,000',
    timestamp: Date.now() - 480000, // 8 minutes ago
    status: 'active'
  },
  {
    id: '4',
    type: 'sale',
    domain: 'defi.sol',
    amount: '75,000',
    timestamp: Date.now() - 900000, // 15 minutes ago
    status: 'completed'
  },
  {
    id: '5',
    type: 'chat',
    domain: 'nft.base',
    timestamp: Date.now() - 1200000, // 20 minutes ago
    status: 'active'
  }
];

function ActivityIcon({ type, status }: { type: string; status: string }) {
  if (type === 'offer') {
    return (
      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }
  
  if (type === 'chat') {
    return (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
    );
  }
  
  if (type === 'sale') {
    return (
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  
  return null;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LiveMarketplaceFeed() {
  const [activities, setActivities] = useState<MarketplaceActivity[]>(mockActivities);
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Occasionally add a new activity to simulate real-time updates
      if (Math.random() > 0.7) {
        const domains = ['web3.xyz', 'dao.eth', 'meta.sol', 'nft.base', 'defi.arb'];
        const types: ('offer' | 'chat')[] = ['offer', 'chat'];
        const randomDomain = domains[Math.floor(Math.random() * domains.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newActivity: MarketplaceActivity = {
          id: Date.now().toString(),
          type: randomType,
          domain: randomDomain,
          amount: randomType === 'offer' ? (Math.floor(Math.random() * 100000) + 10000).toLocaleString() : undefined,
          timestamp: Date.now(),
          status: 'active'
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 6)]); // Keep only 7 items
      }
    }, 8000); // Update every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
        <span className="text-sm text-gray-500">Real-time marketplace feed</span>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
          >
            <ActivityIcon type={activity.type} status={activity.status} />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{activity.domain}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {activity.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                {activity.type === 'offer' && activity.amount && (
                  `New offer: $${activity.amount} USDC`
                )}
                {activity.type === 'chat' && 'New conversation started'}
                {activity.type === 'sale' && activity.amount && (
                  `Sold for $${activity.amount} USDC`
                )}
              </p>
            </div>
            
            <div className="text-xs text-gray-500">
              {formatTimeAgo(activity.timestamp)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Live updates every few seconds • {activities.length} recent activities
        </p>
      </div>
    </div>
  );
}