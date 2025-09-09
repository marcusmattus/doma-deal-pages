'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatContent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">
          XMTP Chat
        </h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-900">Chat Topic</h2>
            <p className="text-blue-700 text-sm font-mono break-all">
              {topic || 'No topic specified'}
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Demo Mode</h3>
            <p className="text-yellow-700 text-sm">
              This is a placeholder for the XMTP chat integration. 
              In a production app, this would open the XMTP client with the 
              domain-bound conversation thread.
            </p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Topic Format:</strong> doma://{'{tld}'}/{'{label}'}#{'{offerId}'}</p>
            <p><strong>Purpose:</strong> Domain-bound offer discussions</p>
            <p><strong>Features:</strong> Persistent chat, offer negotiation, deal closure</p>
          </div>
        </div>

        <a 
          href="/"
          className="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading chat...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}