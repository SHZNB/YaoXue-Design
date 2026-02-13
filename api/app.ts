/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'

// load env
dotenv.config()

const app: express.Application = express()

// Security headers
app.use(helmet())

// Strict CORS (allow list via env)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)

// Compression
app.use(compression())

// Lower body limits to mitigate abuse
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))

// Global rate limiter for API
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200, // 200 reqs per 5 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', apiLimiter)

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
  // Ensure next is used or eslint-disable it if strictly not needed
  // In Express error handlers, we must keep the arity of 4, so _next is required even if unused.
  // We can just call it to be safe or leave it as _next which is usually ignored by typescript-eslint if configured so.
  // But here it seems the linter is strict.
  if (_next) {
      // Do nothing, just to satisfy linter
  }
})

/**
 * 404 handler
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
