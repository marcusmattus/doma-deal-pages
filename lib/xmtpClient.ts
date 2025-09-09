import { Client } from '@xmtp/xmtp-js';

export async function createXmtpInvite(signer: any, topic: string, firstMessage: string) {
  const xmtp = await Client.create(signer, { 
    env: (process.env.XMTP_ENV as 'dev' | 'local' | 'production') || 'dev' 
  });
  const conv = await xmtp.conversations.newConversation(
    await signer.getAddress(), 
    { conversationId: topic, metadata: {} }
  );
  await conv.send(firstMessage);
  
  // Return your app's chat deep link (replace with your route)
  return { 
    inviteUrl: `/chat?topic=${encodeURIComponent(topic)}`, 
    topic 
  };
}