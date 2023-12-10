import { type NextFunction, type Request, type Response } from 'express'
import User from '../models/user'
import ApiError from '../utils/apiError'
import { type IHistory, type IPost, type IUser } from '../../types'
import Post from '../models/post'
import History from '../models/historySearch'

const validationId = (model: string) => {
  if (model === 'user') {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const user: IUser | null = await User.findById(id)
      if (!user) { next(new ApiError('User not found', 404)); return }
      next()
    }
  } else if (model === 'post') {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const post: IPost | null = await Post.findById(id)
      if (!post) { next(new ApiError('Post not found', 404)); return }
      next()
    }
  } else {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const history: IHistory | null = await History.findById(id)
      if (!history) { next(new ApiError('History not found', 404)); return }
      next()
    }
  }
}

export default validationId
