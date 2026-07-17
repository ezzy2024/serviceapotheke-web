const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function query() {
  await client.connect();
  const tables = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'");
  console.log('Tables:', tables.rows.map(r => r.tablename));
  await client.end();
}

query().catch(console.error);
