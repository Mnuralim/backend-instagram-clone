import { type Request, type Response, type NextFunction } from 'express'
import type ApiError from '../utils/apiError'

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}

export default errorHandler
