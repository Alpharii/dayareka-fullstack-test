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

// Function to run seeders
const runSeeders = async () => {
  try {
    console.log('Starting seeders...')

    // Path to the seeders directory
    const seedersDir = path.join(__dirname, '../seeders')
    const files = fs.readdirSync(seedersDir).sort()

    for (const file of files) {
      const filePath = path.join(seedersDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      console.log(`Running seeder: ${file}`)
      await pool.query(sql)
    }

    console.log('All seeders completed successfully.')
  } catch (error) {
    console.error('Error during seeding:', error)
  } finally {
    await pool.end()
  }
}

// Run the seeders
runSeeders()
