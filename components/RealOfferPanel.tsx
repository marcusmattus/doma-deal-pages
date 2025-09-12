'use client';

import { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createOffer } from '@/lib/domaClient';
import { track } from '@/lib/metrics';
import Countdown from './Countdown';

interface DomainKey {
  tld: string;
  label: string;
}

interface RealOfferPanelProps {
  domainKey: DomainKey;
}

export default function RealOfferPanel({ domainKey }: RealOfferPanelProps) {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [price, setPrice] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [offer, setOffer] = useState<{
    offerId: string;
    expiresAt: number;
    status: string;
    txHash?: string;
  } | null>(null);

  const userAddress = user?.wallet?.address || wallets?.[0]?.address;

  async function onSubmit() {
    if (!authenticated || !userAddress) {
      alert('Please connect your wallet first to make an offer.');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + (minutes * 60);
      
      // Call real Doma API to create offer
      const result = await createOffer({
        key: domainKey,
        price,
        expiresAt,
        buyer: userAddress as `0x${string}`
      });
      
      setOffer({
        offerId: result.offerId,
        expiresAt,
        status: result.status || 'pending',
        txHash: result.txHash
      });
      
      track('offer_created', { 
        ...domainKey, 
        price, 
        minutes, 
        offerId: result.offerId,
        txHash: result.txHash 
      });
    } catch (error: any) {
      console.error('Failed to create offer:', error);
      alert('Failed to create offer: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4m-4 6h.01M10 19a2 2 0 01-2-2V9a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H10z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Make Offers</h3>
          <p className="text-gray-600 text-sm mb-4">
            Connect your wallet to create time-boxed offers for this domain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Make a Time-Boxed Offer</h3>
          <p className="text-gray-600 text-sm">Create on-chain offer with automatic expiration</p>
        </div>
      </div>

      {!offer ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">Connected as:</p>
                <code className="text-blue-700 bg-blue-100 px-2 py-1 rounded text-xs">
                  {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Unknown'}
                </code>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Price
              </label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  placeholder="0.00" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-500 text-sm font-medium">USDC</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires In
              </label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={minutes} 
                onChange={e => setMinutes(Number(e.target.value))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={360}>6 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-yellow-800 font-medium mb-1">On-chain Offer:</p>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Your offer will be submitted to Doma Protocol</li>
                  <li>• Gas fees will apply for on-chain transaction</li>
                  <li>• Offer automatically expires after selected time</li>
                  <li>• The domain owner can accept during this period</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={onSubmit} 
            disabled={submitting || !price} 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Offer...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit On-Chain Offer
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Offer Submitted to Doma Protocol!</h4>
                <p className="text-green-700 text-sm">
                  Offer ID: <code className="bg-green-100 px-1 rounded font-mono text-xs">{offer.offerId}</code>
                </p>
              </div>
            </div>
          </div>

          {offer.txHash && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-2">
                <strong>Transaction Hash:</strong>
              </p>
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs break-all">
                {offer.txHash}
              </code>
              <a 
                href={`https://sepolia.basescan.org/tx/${offer.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs ml-2 hover:underline"
              >
                View on BaseScan ↗
              </a>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Time Remaining:</span>
              <Countdown endsAt={offer.expiresAt} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Offer Amount:</span>
              <span className="font-bold text-lg">${price} USDC</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                offer.status === 'completed' ? 'bg-green-100 text-green-800' :
                offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {offer.status}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Your offer is live on Doma Protocol. Continue below to message the seller.
            </p>
            <button
              onClick={() => setOffer(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 hover:underline"
            >
              Make Another Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}