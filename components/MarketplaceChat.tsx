'use client';

import { useState, useEffect } from 'react';

interface DomainKey {
  tld: string;
  label: string;
}

interface MarketplaceChatProps {
  domainKey: DomainKey;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  message: string;
  timestamp: number;
  type: 'text' | 'offer' | 'system';
  amount?: string;
}

// Mock chat messages for demonstration
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'seller',
    message: 'Hi! Thanks for your interest in this domain. I\'m the current owner.',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    type: 'text'
  },
  {
    id: '2',
    sender: 'buyer',
    message: 'Hello! I\'m really interested in acquiring this domain for my project. What\'s your asking price?',
    timestamp: Date.now() - 1680000, // 28 minutes ago
    type: 'text'
  },
  {
    id: '3',
    sender: 'seller',
    message: 'I was thinking around $50K USDC. It\'s a premium domain with good metrics.',
    timestamp: Date.now() - 1620000, // 27 minutes ago
    type: 'text'
  },
  {
    id: '4',
    sender: 'buyer',
    message: 'That\'s a bit high for my budget. Would you consider $35K?',
    timestamp: Date.now() - 1560000, // 26 minutes ago
    type: 'offer',
    amount: '35,000'
  }
];

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isOwnMessage = message.sender === 'buyer'; // Assume user is buyer
  
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwnMessage 
          ? 'bg-blue-600 text-white' 
          : message.type === 'offer' 
            ? 'bg-orange-100 border border-orange-200' 
            : 'bg-gray-100'
      }`}>
        {message.type === 'offer' && (
          <div className="text-xs font-semibold text-orange-600 mb-1">
            💰 OFFER
          </div>
        )}
        
        <p className={`text-sm ${
          isOwnMessage ? 'text-white' : message.type === 'offer' ? 'text-orange-800' : 'text-gray-900'
        }`}>
          {message.message}
        </p>
        
        {message.amount && (
          <div className={`text-xs font-bold mt-1 ${
            isOwnMessage ? 'text-blue-200' : 'text-orange-700'
          }`}>
            ${message.amount} USDC
          </div>
        )}
        
        <div className={`text-xs mt-1 ${
          isOwnMessage ? 'text-blue-200' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceChat({ domainKey }: MarketplaceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickOffers, setShowQuickOffers] = useState(false);

  // Simulate typing indicator occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'buyer',
      message: newMessage,
      timestamp: Date.now(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate seller response after a delay
    setTimeout(() => {
      const responses = [
        'Interesting, let me think about that.',
        'I appreciate the offer. Let me get back to you.',
        'That\'s getting closer to what I had in mind.',
        'I\'m considering multiple offers right now.'
      ];
      
      const sellerResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'seller',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, sellerResponse]);
    }, 2000 + Math.random() * 3000);
  };

  const sendQuickOffer = (amount: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'buyer',
      message: `I'd like to offer $${amount} USDC for ${domainKey.label}.${domainKey.tld}`,
      timestamp: Date.now(),
      type: 'offer',
      amount: amount
    };
    
    setMessages(prev => [...prev, message]);
    setShowQuickOffers(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-96">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              💬 {domainKey.label}.{domainKey.tld}
            </h3>
            <p className="text-sm text-gray-600">Live negotiation</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Offers */}
      {showQuickOffers && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Quick offers:</p>
          <div className="flex gap-2 flex-wrap">
            {['25,000', '30,000', '35,000', '40,000'].map((amount) => (
              <button
                key={amount}
                onClick={() => sendQuickOffer(amount)}
                className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors duration-200"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setShowQuickOffers(!showQuickOffers)}
            className="px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-200 text-sm"
          >
            💰
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}