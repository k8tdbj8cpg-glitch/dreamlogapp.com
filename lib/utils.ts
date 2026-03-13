import type {
  AssistantModelMessage,
  ToolModelMessage,
  UIMessage,
  UIMessagePart,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { formatISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import type { DBMessage, Document } from '@/lib/db/schema';
import { ChatbotError, type ErrorCode } from './errors';
import type { ChatMessage, ChatTools, CustomUIDataTypes } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatbotError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatbotError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatbotError('offline:chat');
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

/**
 * Returns `true` when the end-to-end encryption feature is available for the
 * given user.
 *
 * E2EE is a **premium-only** feature restricted to U.S. users. The locale
 * check uses the browser's `Intl` API as a best-effort client-side signal.
 * For production enforcement, combine this with server-side IP geolocation or
 * user-verified location stored in the account profile, as timezone values can
 * be changed by the user.
 *
 * @param userType - The type of the currently authenticated user.
 */
export function isEncryptionEligible(userType: string): boolean {
  const isPremium = userType === 'premium';
  const isUsLocale =
    typeof Intl !== 'undefined'
      ? isUsTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      : false;
  return isPremium && isUsLocale;
}

/**
 * Checks if a timezone identifier corresponds to a U.S. timezone.
 * Includes all IANA timezone identifiers for U.S. states and territories.
 */
function isUsTimezone(timezone: string): boolean {
  // U.S. timezone identifiers from the IANA timezone database
  const usTimezones = new Set([
    // CONUS (Continental U.S.)
    'America/New_York',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Indiana/Indianapolis',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Vevay',
    'America/Indiana/Winamac',
    'America/Indiana/Knox',
    'America/Indiana/Tell_City',
    'America/Chicago',
    'America/Indiana/Chicago',
    'America/Menominee',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/North_Dakota/Beulah',
    'America/Denver',
    'America/Boise',
    'America/Los_Angeles',
    'America/Anchorage',
    'America/Juneau',
    'America/Metlakatla',
    'America/Sitka',
    'America/Yakutat',
    'America/Nome',
    'America/Adak',
    // Hawaii
    'Pacific/Honolulu',
    // U.S. Territories in Pacific
    'Pacific/Pago_Pago', // American Samoa
    'Pacific/Guam', // Guam
    'Pacific/Saipan', // Northern Mariana Islands
    // U.S. Territories in Atlantic/Caribbean
    'America/Puerto_Rico',
    'America/Virgin',
  ]);

  return usTimezones.has(timezone);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = ToolModelMessage | AssistantModelMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: UIMessage[]) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Document[],
  index: number,
) {
  if (!documents) { return new Date(); }
  if (index > documents.length) { return new Date(); }

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: ResponseMessage[];
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) { return null; }

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

export function sanitizeUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined;
  }
  try {
    const { protocol } = new URL(url);
    if (protocol === 'http:' || protocol === 'https:') {
      return url;
    }
  } catch {
    // Invalid URL
  }
  return undefined;
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage | UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string}).text)
    .join('');
}
