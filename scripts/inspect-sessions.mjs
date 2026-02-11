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

const rows = await sql`
  SELECT id, status, current_step, responses, dimension_accumulator, profile, created_at
  FROM sessions ORDER BY created_at DESC LIMIT 10
`;

if (rows.length === 0) {
  console.log('No sessions found. Start a new session first.');
  process.exit(0);
}

for (const s of rows) {
  console.log('='.repeat(60));
  console.log(`Session: ${s.id}`);
  console.log(`Status:  ${s.status} | Step: ${s.current_step}`);
  console.log(`Created: ${s.created_at}`);

  // Check responses
  const responses = s.responses || [];
  console.log(`\nResponses: ${responses.length} total`);
  const byType = {};
  for (const r of responses) {
    byType[r.questionType] = (byType[r.questionType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }

  // Check accumulator
  const acc = s.dimension_accumulator || {};
  console.log('\nAccumulator:');
  let allZero = true;
  for (const [dim, val] of Object.entries(acc)) {
    const { sum, count } = val;
    const avg = count > 0 ? (sum / count).toFixed(2) : 'n/a';
    console.log(`  ${dim.padEnd(12)} sum=${String(sum).padStart(7)} count=${String(count).padStart(3)} avg=${avg}`);
    if (count > 0) allZero = false;
  }
  if (allZero) {
    console.log('  ⚠️  ALL ZEROS — scores were never accumulated!');
  }

  // Check profile
  const profile = s.profile;
  if (profile) {
    console.log('\nProfile:');
    console.log(`  Archetype: ${profile.archetypeName} (${profile.archetypeId})`);
    console.log(`  Distance:  ${profile.archetypeDistance?.toFixed(2)}`);
    console.log('  Dimension scores:');
    for (const d of profile.dimensions) {
      console.log(`    ${d.dimensionId.padEnd(12)} score=${String(d.score).padStart(3)} confidence=${d.confidence}`);
    }
  } else {
    console.log('\nProfile: not computed yet');
  }
  console.log('');
}
