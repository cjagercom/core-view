import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const dbUrl = envContent
  .split('\n')
  .find((l) => l.startsWith('DATABASE_URL='))
  .split('=')
  .slice(1)
  .join('=');
const sql = neon(dbUrl);

console.log('Running deep-dive migrations...');

// Add deep-dive columns
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS deep_dive_messages jsonb DEFAULT '[]'`;
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS deep_dive_adjustments jsonb DEFAULT NULL`;
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS profile_v1 jsonb DEFAULT NULL`;

// Add reconciliation columns
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reconciliation_messages jsonb DEFAULT '[]'`;
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reconciliation_adjustments jsonb DEFAULT NULL`;
await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS profile_v2 jsonb DEFAULT NULL`;

console.log('Migration complete. New columns added:');
console.log('  - deep_dive_messages (jsonb)');
console.log('  - deep_dive_adjustments (jsonb)');
console.log('  - profile_v1 (jsonb)');
console.log('  - reconciliation_messages (jsonb)');
console.log('  - reconciliation_adjustments (jsonb)');
console.log('  - profile_v2 (jsonb)');
