export interface Joke {
  _id: string;
  content: string;
  type: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
