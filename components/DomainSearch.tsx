'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DomainSearch() {
  const [domain, setDomain] = useState('');
  const [searching, setSearching] = useState(false);
  const router = useRouter();

  async function handleSearch() {
    if (!domain.trim()) return;
    
    setSearching(true);
    
    // Parse domain format (e.g., "laser.ape" -> tld: "ape", label: "laser")
    const parts = domain.trim().split('.');
    if (parts.length >= 2) {
      const label = parts[0];
      const tld = parts[1];
      
      // Navigate to the domain deal page
      router.push(`/${tld}/${label}`);
    } else {
      alert('Please enter a valid domain format (e.g., laser.ape)');
    }
    
    setSearching(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <input 
        type="text" 
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter domain (e.g. laser.ape)"
        className="px-6 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 text-center transition-all duration-200"
        disabled={searching}
      />
      <button 
        onClick={handleSearch}
        disabled={searching || !domain.trim()}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {searching ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Search'
        )}
      </button>
    </div>
  );
}