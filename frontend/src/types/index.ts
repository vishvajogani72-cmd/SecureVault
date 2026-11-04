export type Category = 'Personal' | 'Work' | 'Finance' | 'Social' | 'Entertainment' | 'Developer' | 'Other';

export interface Credential {
  id: string;
  website: string;
  url?: string;
  username: string;
  password: string;
  notes?: string;
  category: Category;
  favorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt?: number;
}

export interface GenerateOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export const CATEGORIES: Category[] = [
  'Personal',
  'Work',
  'Finance',
  'Social',
  'Entertainment',
  'Developer',
  'Other',
];
