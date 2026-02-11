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

// List current sessions
const rows = await sql`SELECT id, status, current_step, created_at FROM sessions ORDER BY created_at DESC`;
console.log('Current sessions:');
for (const s of rows) {
  console.log(`  ${s.id} | ${s.status} | ${s.current_step} | ${s.created_at}`);
}
console.log(`Total: ${rows.length}\n`);

// Delete all sessions
const deleted = await sql`DELETE FROM sessions RETURNING id`;
console.log(`Deleted ${deleted.length} sessions.`);

// Also clear analytics
const deletedAnalytics = await sql`DELETE FROM analytics_events RETURNING id`;
console.log(`Deleted ${deletedAnalytics.length} analytics events.`);

console.log('\nDatabase is clean. Ready for a fresh session.');
