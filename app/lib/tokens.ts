import { nanoid } from 'nanoid';

export function generateSessionToken(): string {
  return nanoid(12);
}

export function generateFeedbackToken(): string {
  return nanoid(12);
}

export function generateShareToken(): string {
  return nanoid(12);
}
