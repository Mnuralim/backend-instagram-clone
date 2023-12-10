/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Request, type Response, type NextFunction } from 'express'

import ApiError from '../utils/apiError'
import { type IComment, type IPost } from '../../types'
import Comment from '../models/comment'
import Post from '../models/post'

export const addNewComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { text }: { text: string } = req.body

  try {
    const post: IPost | null = await Post.findById(id)

    await Comment.create({
      user: req.user._id,
      post: id,
      replies: [],
      text
    })

    if (post) {
      const prevTotalComment: number = post.totalComment
      post.totalComment = prevTotalComment + 1

      await post?.save()
    }

    res.status(201).json({
      success: true,
      message: 'Add comment successfully'
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const comments: IComment[] = await Comment.find({
      post: id
    })
      .select('-__v')
      .populate({
        path: 'post',
        select: '-__v',
        populate: {
          path: 'userId likedBy',
          model: 'User',
          select: 'profile _id username'
        }
      })
      .populate({
        path: 'replies',
        select: '-__v',
        populate: {
          path: 'user',
          model: 'User',
          select: 'profile _id username'
        }
      })
      .populate('user', 'profile username')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      data: {
        comments
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const replyComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentid } = req.params
  const { text }: { text: string } = req.body

  try {
    const comment: IComment | null = await Comment.findById(commentid).populate('post')
    if (!comment) { next(new ApiError('Comment not found', 404)); return }

    const post = await Post.findById(comment.post)
    if (!post) { next(new ApiError('Post not found', 404)); return }

    comment.replies.push({
      text,
      user: req.user._id
    })
    const prevTotalComment = post.totalComment
    post.totalComment = prevTotalComment + 1

    await post.save()
    await comment.save()

    res.status(201).json({
      success: true,
      message: 'Add comment successfully'
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}
