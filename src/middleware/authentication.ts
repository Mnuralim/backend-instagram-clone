/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError'
import User from '../models/user'
import { type IPayload, type IUser } from '../../types'

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization
    if (!bearerToken) { next(new ApiError('No token', 401)); return }

    const token = bearerToken.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IPayload

    const user: IUser | null = await User.findById(payload._id)
    req.user = user as IUser

    next()
  } catch (error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    next(new ApiError(error.message, 500))
  }
}

export default authentication
