const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.cswnwrnwiiqdmpjbpdbn',
  password: 'dylan2306',
  database: 'postgres',
  ssl: { rejectUnauthorized: false } // necesario para Supabase
});

client.connect()
  .then(() => console.log('Conectado a Supabase'))
  .catch(err => console.error('Error en la conexión:', err.message));

module.exports = client;