import { User } from '@prisma/client';

export type LocalContext = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName'
> & {
  role: string;
};
