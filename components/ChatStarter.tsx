'use client';

import { useState } from 'react';
import { track } from '@/lib/metrics';
import MarketplaceChat from './MarketplaceChat';

interface DomainKey {
  tld: string;
  label: string;
}

interface ChatStarterProps {
  domainKey: DomainKey;
}

export default function ChatStarter({ domainKey }: ChatStarterProps) {
  const [showChat, setShowChat] = useState(false);
  const [opening, setOpening] = useState(false);

  async function openChat() {
    setOpening(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      track('chat_started', { ...domainKey, topic: `doma://${domainKey.tld}/${domainKey.label}#offer` });
      
      setShowChat(true);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setOpening(false);
    }
  }

  if (showChat) {
    return <MarketplaceChat domainKey={domainKey} />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift">
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Live Marketplace Chat</h3>
          <p className="text-gray-600 text-sm">Join the live negotiation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2V6a2 2 0 012-2h2a2 2 0 012 2v2z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Live Marketplace Features:</p>
              <ul className="text-blue-700 space-y-1">
                <li>• Real-time chat with domain owner</li>
                <li>• Quick offer buttons for fast negotiation</li>
                <li>• See active conversations happening now</li>
                <li>• Secure XMTP protocol messaging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Owner is online now</span>
          </div>
        </div>

        <button 
          onClick={openChat} 
          disabled={opening} 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
        >
          {opening ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining Chat...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Join Live Chat
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Real-time marketplace powered by XMTP • 
            <a href="https://xmtp.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1 transition-colors duration-200 hover:underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}