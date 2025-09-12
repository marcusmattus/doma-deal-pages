import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';

let client: Client | null = null;

export interface XMTPMessage {
  id: string;
  content: string;
  senderAddress: string;
  sent: Date;
  contentType: string;
}

export async function initializeXMTPClient(signer: ethers.Signer): Promise<Client> {
  try {
    // Check if we already have a client for this signer
    const address = await signer.getAddress();
    if (client && await client.address === address) {
      return client;
    }

    // Create new client
    client = await Client.create(signer, { 
      env: process.env.XMTP_ENV as 'dev' | 'production' | undefined || 'dev' 
    });
    
    return client;
  } catch (error) {
    console.error('Failed to initialize XMTP client:', error);
    throw error;
  }
}

export async function createConversation(client: Client, peerAddress: string) {
  try {
    // Check if we can message this address
    const canMessage = await client.canMessage(peerAddress);
    if (!canMessage) {
      throw new Error('Cannot message this address - they may not have XMTP enabled');
    }

    // Create or get existing conversation
    const conversation = await client.conversations.newConversation(peerAddress);
    return conversation;
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw error;
  }
}

export async function sendMessage(client: Client, peerAddress: string, content: string) {
  try {
    const conversation = await createConversation(client, peerAddress);
    await conversation.send(content);
    return true;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

export async function getMessages(client: Client, peerAddress: string): Promise<XMTPMessage[]> {
  try {
    const conversation = await createConversation(client, peerAddress);
    const messages = await conversation.messages();
    
    return messages.map((msg, index) => ({
      id: `${msg.sent.getTime()}-${index}`,
      content: msg.content,
      senderAddress: msg.senderAddress,
      sent: msg.sent,
      contentType: msg.contentType?.toString() || 'text'
    }));
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
}

export function isMyMessage(message: XMTPMessage, myAddress: string): boolean {
  return message.senderAddress.toLowerCase() === myAddress.toLowerCase();
}

// Stream messages for real-time updates
export async function streamMessages(
  client: Client, 
  peerAddress: string, 
  callback: (message: XMTPMessage) => void
) {
  try {
    const conversation = await createConversation(client, peerAddress);
    
    // Stream new messages
    for await (const message of await conversation.streamMessages()) {
      const xmtpMessage: XMTPMessage = {
        id: `${message.sent.getTime()}-${Date.now()}`,
        content: message.content,
        senderAddress: message.senderAddress,
        sent: message.sent,
        contentType: message.contentType?.toString() || 'text'
      };
      
      callback(xmtpMessage);
    }
  } catch (error) {
    console.error('Failed to stream messages:', error);
  }
}