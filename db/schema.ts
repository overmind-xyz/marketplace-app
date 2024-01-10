export type User = {
  username: string;
  profilePic: string;
  bio: string;
  shippingAddress: string;
  timestamp: string;
  balance: number;
  password: string;
};

export const UserSchema = `CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  profilePic TEXT,
  bio TEXT,
  shippingAddress TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  balance INTEGER DEFAULT 0,
  password TEXT
)`;

export type Item = {
  id: string;
  owner: string;
  title: string;
  description: string;
  price: number;
  totalSupply: number;
  availableSupply: number;
  timestamp: string;
  listed: 0 | 1; // 0 = false, 1 = true
  image: string;
  category: string;
};

export const ItemSchema = `CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  price INTEGER,
  totalSupply INTEGER,
  availableSupply INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  listed BOOLEAN DEFAULT TRUE,
  image TEXT,
  owner TEXT,
  category TEXT
)`;

export type Rating = {
  id: number;
  target: string;
  author: string;
  stars: number;
  comment: string;
  timestamp: string;
};

export const RatingSchema = `CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY DEFAULT AUTO_INCREMENT,
  target TEXT,
  author TEXT,
  stars INTEGER,
  comment TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

export type Purchase = {
  id: number;
  itemId: string;
  buyer: string;
  seller: string;
  timestamp: string;
  quantity: number;
  itemPrice: number;
  status: "pending" | "shipped" | "delivered";
  txnDigest: string;
};

export const PurchaseSchema = `CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY DEFAULT AUTO_INCREMENT,
  itemId TEXT,
  buyer TEXT,
  seller TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  quantity INTEGER,
  itemPrice INTEGER,
  status TEXT DEFAULT 'pending',
  txnDigest TEXT
)`;

export const isPurchase = (item: Item | Purchase): boolean => {
  return (item as Purchase).seller !== undefined;
};

export type WatchList = {
  userId: string;
  itemId: string;
};

export const WatchlistSchema = `CREATE TABLE IF NOT EXISTS watchlist (
  userId TEXT, 
  itemId TEXT
)`;
