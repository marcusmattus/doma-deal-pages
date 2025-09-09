import { NextRequest, NextResponse } from 'next/server';

// NOTE: In a real app, derive signer from user session/wallet
export async function POST(req: NextRequest) {
  try {
    const { tld, label } = await req.json();
    const topic = `doma://${tld}/${label}#DEMO_${Date.now()}`;
    const inviteUrl = `/chat?topic=${encodeURIComponent(topic)}`;
    
    return NextResponse.json({ 
      inviteUrl, 
      topic, 
      offerId: `DEMO_${Date.now()}` 
    });
  } catch (error) {
    const topic = `doma://example/laser#DEMO`;
    const inviteUrl = `/chat?topic=${encodeURIComponent(topic)}`;
    
    return NextResponse.json({ 
      inviteUrl, 
      topic, 
      offerId: 'DEMO' 
    });
  }
}