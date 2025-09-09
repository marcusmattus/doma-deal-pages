'use client';

import { useState } from 'react';
import { track } from '@/lib/metrics';

interface DomainKey {
  tld: string;
  label: string;
}

interface ChatStarterProps {
  domainKey: DomainKey;
}

export default function ChatStarter({ domainKey }: ChatStarterProps) {
  const [opening, setOpening] = useState(false);

  async function openChat() {
    setOpening(true);
    try {
      const r = await fetch('/api/xmtp/session', { 
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(domainKey)
      });
      
      const { inviteUrl, topic, offerId } = await r.json();
      track('chat_started', { ...domainKey, offerId, topic });
      
      // Open in new tab
      window.open(inviteUrl, '_blank');
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setOpening(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Message the Seller</h3>
          <p className="text-gray-600 text-sm">Start a secure conversation using XMTP</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">XMTP Protocol Benefits:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• End-to-end encrypted messaging</li>
                <li>• Domain-bound conversation thread</li>
                <li>• Persistent chat history</li>
                <li>• No platform lock-in</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Chat Topic:</p>
            <code className="bg-white px-2 py-1 rounded text-xs break-all">
              doma://{domainKey.tld}/{domainKey.label}#offer
            </code>
          </div>
        </div>

        <button 
          onClick={openChat} 
          disabled={opening} 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {opening ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Opening Chat...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start XMTP Chat
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Powered by XMTP Protocol • 
            <a href="https://xmtp.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}