import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/v1', router)

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
