
import type { GenerateOptions } from '@/types';

// Character sets
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const NUMBERS = '23456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?/';

// Generate a secure random integer without modulo bias
function secureRandomInt(max: number): number {
  if (
    !Number.isSafeInteger(max) ||
    max < 1 ||
    max > 0x100000000
  ) {
    throw new Error('Invalid random range');
  }

  const range = 0x100000000;
  const limit = range - (range % max);
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
}

// Pick one random character securely
function randomChar(pool: string): string {
  if (!pool.length) {
    throw new Error('Character pool cannot be empty');
  }

  return pool[secureRandomInt(pool.length)];
}

// Generate password
export function generatePassword(options: GenerateOptions): string {
  if (
    !Number.isInteger(options.length) ||
    options.length < 8 ||
    options.length > 48
  ) {
    throw new Error('Password length must be between 8 and 48');
  }

  let pool = '';
  const required: string[] = [];

  const upper = options.excludeAmbiguous
    ? UPPER
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const lower = options.excludeAmbiguous
    ? LOWER
    : 'abcdefghijklmnopqrstuvwxyz';

  const numbers = options.excludeAmbiguous
    ? NUMBERS
    : '0123456789';

  if (options.uppercase) {
    pool += upper;
    required.push(randomChar(upper));
  }

  if (options.lowercase) {
    pool += lower;
    required.push(randomChar(lower));
  }

  if (options.numbers) {
    pool += numbers;
    required.push(randomChar(numbers));
  }

  if (options.symbols) {
    pool += SYMBOLS;
    required.push(randomChar(SYMBOLS));
  }

  // Default to lowercase if no character set is selected
  if (!pool) {
    pool = lower;
    required.push(randomChar(lower));
  }

  // Fill remaining password positions
  const chars: string[] = [...required];

  while (chars.length < options.length) {
    chars.push(randomChar(pool));
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

// Password strength result
export interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Too weak' | 'Weak' | 'Fair' | 'Strong' | 'Very strong';
  percent: number;
}

// Evaluate password strength (basic UI estimate)
export function evaluateStrength(password: string): StrengthResult {
  if (!password) {
    return { score: 0, label: 'Too weak', percent: 0 };
  }

  let points = 0;

  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (password.length >= 16) points++;
  if (/[a-z]/.test(password)) points++;
  if (/[A-Z]/.test(password)) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[^a-zA-Z0-9]/.test(password)) points++;

  const score = Math.min(
    4,
    Math.floor(points / 2)
  ) as StrengthResult['score'];

  const labels: StrengthResult['label'][] = [
    'Too weak',
    'Weak',
    'Fair',
    'Strong',
    'Very strong',
  ];

  return {
    score,
    label: labels[score],
    percent: (score / 4) * 100,
  };
}
