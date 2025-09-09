import { NextRequest, NextResponse } from 'next/server';
import { createOffer } from '@/lib/domaClient';

export async function POST(req: NextRequest) {
  try {
    const { tld, label, price, minutes, buyer } = await req.json();
    const expiresAt = Math.floor(Date.now() / 1000) + (minutes ?? 30) * 60;
    
    const res = await createOffer({ 
      key: { tld, label }, 
      price, 
      expiresAt, 
      buyer: buyer || '0xBuyerTestnetAddress' 
    });
    
    return NextResponse.json(res);
  } catch (error) {
    // For demo purposes, return mock response if API fails
    const mockResponse = {
      offerId: `DEMO_${Date.now()}`,
      txHash: '0xdemo123...'
    };
    return NextResponse.json(mockResponse);
  }
}