import bcrypt from 'bcryptjs';

const PASSWORD_COST = 12;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, PASSWORD_COST);

export const verifyPassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);
