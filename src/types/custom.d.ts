declare namespace Express {
  export interface Request {
    user?: {
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };
  }
}
