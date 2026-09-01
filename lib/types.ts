export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  avatar_url: string;
  banner_url: string;
  description: string;
  subscribers_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}
