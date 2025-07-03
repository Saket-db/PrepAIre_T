// import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless'

const client = neon(process.env.NEON_DB_CONNECTION_STRING!);

export const db = drizzle(client);