import { Pool } from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config()

// Initialize PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Function to drop all tables
const resetTables = async () => {
  try {
    console.log('Dropping all tables...')

    // Query untuk mendapatkan semua tabel dalam skema public
    const getTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `

    // Jalankan query untuk mendapatkan daftar tabel
    const result = await pool.query(getTablesQuery)
    const tables = result.rows.map((row) => row.table_name)

    // Hapus semua tabel
    for (const table of tables) {
      console.log(`Dropping table: ${table}`)
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`)
    }

    console.log('All tables dropped successfully.')
  } catch (error) {
    console.error('Error dropping tables:', error)
    throw error // Rethrow error agar migrasi tidak dilanjutkan jika gagal
  }
}

// Function to run migrations
const runMigrations = async () => {
  try {
    // Drop all tables before running migrations
    await resetTables()

    console.log('Starting migrations...')

    // Path ke folder migrations
    const migrationsDir = path.join(__dirname, '../migrations')
    const files = fs.readdirSync(migrationsDir).sort()

    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running migration: ${file}`)
      await pool.query(sql)
    }

    console.log('All migrations completed successfully.')
  } catch (error) {
    console.error('Error during migrations:', error)
  } finally {
    await pool.end()
  }
}

// Run the migrations
runMigrations()
