'use client';

import { useState, useEffect, useRef } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { 
  initializeXMTPClient, 
  sendMessage, 
  getMessages, 
  streamMessages, 
  isMyMessage,
  XMTPMessage 
} from '@/lib/xmtp';

interface DomainKey {
  tld: string;
  label: string;
}

interface RealXMTPChatProps {
  domainKey: DomainKey;
  sellerAddress: string; // Address of domain owner
}

export default function RealXMTPChat({ domainKey, sellerAddress }: RealXMTPChatProps) {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [messages, setMessages] = useState<XMTPMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const [initializingXMTP, setInitializingXMTP] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<boolean>(false);

  const userAddress = user?.wallet?.address || wallets?.[0]?.address;

  // Initialize XMTP client
  useEffect(() => {
    async function setupXMTP() {
      if (!authenticated || !userAddress || !wallets?.[0]) {
        setInitializingXMTP(false);
        return;
      }

      try {
        setInitializingXMTP(true);
        setError(null);

        // Get the wallet provider
        const wallet = wallets[0];
        await wallet.switchChain(84532); // Base Sepolia
        
        const provider = await wallet.getEthersProvider();
        const signer = provider.getSigner();

        // Initialize XMTP client
        const client = await initializeXMTPClient(signer);
        setXmtpClient(client);

        // Load existing messages
        const existingMessages = await getMessages(client, sellerAddress);
        setMessages(existingMessages);

        // Start streaming new messages
        if (!streamRef.current) {
          streamRef.current = true;
          streamMessages(client, sellerAddress, (message) => {
            setMessages(prev => {
              // Avoid duplicates
              const exists = prev.some(m => m.id === message.id);
              if (exists) return prev;
              return [...prev, message];
            });
          });
        }

      } catch (error: any) {
        console.error('XMTP setup failed:', error);
        setError(error.message || 'Failed to initialize chat');
      } finally {
        setInitializingXMTP(false);
      }
    }

    setupXMTP();

    return () => {
      streamRef.current = false;
    };
  }, [authenticated, userAddress, wallets, sellerAddress]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !xmtpClient) return;

    setLoading(true);
    try {
      await sendMessage(xmtpClient, sellerAddress, newMessage);
      setNewMessage('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError('Failed to send message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendQuickOffer = async (amount: string) => {
    if (!xmtpClient) return;

    const offerMessage = `💰 OFFER: I'd like to offer $${amount} USDC for ${domainKey.label}.${domainKey.tld}. Let me know if you're interested!`;
    
    setLoading(true);
    try {
      await sendMessage(xmtpClient, sellerAddress, offerMessage);
    } catch (error: any) {
      console.error('Failed to send offer:', error);
      setError('Failed to send offer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4m-4 6h.01M10 19a2 2 0 01-2-2V9a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H10z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect to Start Chatting</h3>
          <p className="text-gray-600 text-sm mb-4">
            You need to connect your wallet to start messaging with the domain owner.
          </p>
        </div>
      </div>
    );
  }

  if (initializingXMTP) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Initializing XMTP Chat</h3>
          <p className="text-gray-600 text-sm">Setting up secure messaging...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Setup Failed</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              💬 {domainKey.label}.{domainKey.tld}
            </h3>
            <p className="text-sm text-gray-600">
              Chatting with {formatAddress(sellerAddress)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">XMTP</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messages.map((message) => {
          const isOwn = isMyMessage(message, userAddress!);
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwn 
                  ? 'bg-blue-600 text-white' 
                  : message.content.includes('💰 OFFER')
                    ? 'bg-orange-100 border border-orange-200' 
                    : 'bg-gray-100'
              }`}>
                {message.content.includes('💰 OFFER') && !isOwn && (
                  <div className="text-xs font-semibold text-orange-600 mb-1">
                    NEW OFFER
                  </div>
                )}
                
                <p className={`text-sm ${
                  isOwn ? 'text-white' : message.content.includes('💰 OFFER') ? 'text-orange-800' : 'text-gray-900'
                }`}>
                  {message.content}
                </p>
                
                <div className={`text-xs mt-1 ${
                  isOwn ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {formatTime(message.sent)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Offers */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Quick offers:</p>
        <div className="flex gap-2 flex-wrap">
          {['25,000', '30,000', '35,000', '40,000'].map((amount) => (
            <button
              key={amount}
              onClick={() => sendQuickOffer(amount)}
              disabled={loading}
              className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200 disabled:opacity-50"
            >
              ${amount}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}