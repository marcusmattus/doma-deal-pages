'use client';

import { useEffect, useState } from 'react';

export default function Countdown({ endsAt }: { endsAt: number }) {
  const [left, setLeft] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => endsAt * 1000 - Date.now();
    
    setLeft(calculateTimeLeft());
    
    const id = setInterval(() => {
      setLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(id);
  }, [endsAt]);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted || left === null) {
    return <span className="text-gray-400">Loading...</span>;
  }
  
  if (left <= 0) {
    return <span className="text-red-600">Expired</span>;
  }
  
  const m = Math.floor(left / 60000); 
  const s = Math.floor((left % 60000) / 1000);
  
  return <span className="font-mono">{m}m {s}s</span>;
}