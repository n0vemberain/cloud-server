import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');

function ensureMessagesFile() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function loadMessages() {
  ensureMessagesFile();
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveMessages(messages) {
  ensureMessagesFile();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

export function createMessage(guestId, username, name, text) {
  const cleanText = (text || '').trim();
  if (!cleanText) {
    throw new Error('Message cannot be empty.');
  }

  const messages = loadMessages();
  const newMsg = {
    id: 'msg_' + crypto.randomBytes(6).toString('hex'),
    guestId: guestId || 'guest',
    username: username || 'guest',
    name: name || username || 'Guest',
    message: cleanText,
    text: cleanText,
    read: false,
    createdAt: new Date().toISOString()
  };

  messages.push(newMsg);
  saveMessages(messages);
  return newMsg;
}

export function getMyMessages(guestId) {
  const messages = loadMessages();
  return messages
    .filter(m => m.guestId === guestId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAllMessages() {
  const messages = loadMessages();
  return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function markMessageAsRead(messageId) {
  const messages = loadMessages();
  const msg = messages.find(m => m.id === messageId);
  if (msg) {
    msg.read = true;
    saveMessages(messages);
    return { success: true, message: msg };
  }
  return { success: false, error: 'Message not found' };
}

export function markAllMessagesAsRead() {
  const messages = loadMessages();
  for (const m of messages) {
    m.read = true;
  }
  saveMessages(messages);
  return { success: true };
}

export function deleteMessage(messageId) {
  const messages = loadMessages();
  const index = messages.findIndex(m => m.id === messageId);
  if (index !== -1) {
    messages.splice(index, 1);
    saveMessages(messages);
    return { success: true };
  }
  return { success: false, error: 'Message not found' };
}

export function getUnreadMessagesCount() {
  const messages = loadMessages();
  return messages.filter(m => !m.read).length;
}
