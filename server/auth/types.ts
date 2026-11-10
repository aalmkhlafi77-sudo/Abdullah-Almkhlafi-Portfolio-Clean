export interface AuthenticatedAdmin {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export {};
