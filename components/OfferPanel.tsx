'use client';

import { useState } from 'react';
import { track } from '@/lib/metrics';
import Countdown from './Countdown';

interface DomainKey {
  tld: string;
  label: string;
}

interface OfferPanelProps {
  domainKey: DomainKey;
}

export default function OfferPanel({ domainKey }: OfferPanelProps) {
  const [price, setPrice] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [offer, setOffer] = useState<{
    offerId: string;
    expiresAt: number;
    status: string;
  } | null>(null);

  async function onSubmit() {
    if (!price || parseFloat(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      const expiresAt = Math.floor(Date.now() / 1000) + (minutes * 60);
      
      const r = await fetch('/api/offer', { 
        method: 'POST', 
        body: JSON.stringify({ ...domainKey, price, minutes }),
        headers: { 'content-type': 'application/json' }
      });
      
      const res = await r.json();
      
      setOffer({
        offerId: res.offerId,
        expiresAt,
        status: res.status || 'pending'
      });
      
      track('offer_started', { ...domainKey, price, minutes, offerId: res.offerId });
    } catch (error) {
      console.error('Failed to create offer:', error);
      alert('Failed to create offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Make a Time-Boxed Offer</h3>
          <p className="text-gray-600 text-sm">Submit an offer with automatic expiration</p>
        </div>
      </div>

      {!offer ? (
        <div className="space-y-4">
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">How it works:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Your offer expires automatically after the selected time</li>
                  <li>• The domain owner can accept during this period</li>
                  <li>• You can message the owner to discuss your offer</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={onSubmit} 
            disabled={submitting || !price} 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Offer...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Offer
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Offer Submitted!</h4>
                <p className="text-green-700 text-sm">Offer ID: <code className="bg-green-100 px-1 rounded">{offer.offerId}</code></p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Time Remaining:</span>
              <Countdown endsAt={offer.expiresAt} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Offer Amount:</span>
              <span className="font-bold text-lg">${price} USDC</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Continue below to message the seller about your offer
            </p>
            <button
              onClick={() => setOffer(null)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Make Another Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}