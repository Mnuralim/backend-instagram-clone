/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type NextFunction, type Request, type Response } from 'express'
import User from '../models/user'
import ApiError from '../utils/apiError'
import imagekit from '../utils/imagekit'
import { type IUser } from '../../types'

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { suggestion, username } = req.query
  try {
    let suggestionOpt = false
    if (suggestion === 'true') {
      suggestionOpt = true
    } else {
      suggestionOpt = false
    }

    const filterData: { username: any } = {
      username: ''
    }

    if (username) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      filterData.username = { $regex: '.*' + username.toString() + '.*', $options: 'i' }
    }

    const users: IUser[] = await User.find(filterData).select(
      '-password -refreshToken -passwordResetExpires -passwordResetToken -__v'
    )
    const allUsers = users
      .map((user) => {
        const alreadyFollow: boolean = user.follower.find((el) => el.toString() === req.user._id?.toString())
        return { ...user.toObject(), alreadyFollow: !!alreadyFollow }
      })
      .filter((user) =>
        suggestionOpt
          ? user._id.toString() !== req.user._id?.toString() && user.alreadyFollow === false
          : user._id.toString() !== req.user._id?.toString()
      )

    res.status(200).json({
      success: true,
      data: {
        users: allUsers
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const user = (await User.findById(id).select(
      '-password -refreshToken -passwordResetExpires -passwordResetToken -__v'
    )) as IUser
    const alreadyFollow = user.follower.find((el) => el.toString() === req.user._id?.toString())
    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          alreadyFollow: !!alreadyFollow
        }
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user
  const { fullName, username, bio, link } = req.body

  try {
    const user: IUser | null = await User.findById(_id)
    const findUsername = await User.findOne({ username })
    if (!user) { next(new ApiError('User not found', 404)); return }

    if (findUsername && findUsername.username !== user.username) { next(new ApiError('Username already taken', 404)); return }

    const file = req.file
    let imgUrl: string = ''
    if (file) {
      const split = file.originalname.split('.')
      const ext = split[split.length - 1]

      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-USER-PROFILE${Date.now()}.${ext}`,
        folder: 'instagram-clone/user_profile'
      })
      imgUrl = uploadedImage.url
    } else {
      imgUrl = user.profile.imageProfile
    }

    user.profile.imageProfile = imgUrl
    user.profile.bio = bio
    user.profile.fullName = fullName
    user.profile.link = link
    user.username = username

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Updated user successfully'
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params

  try {
    const user: IUser = await User.findOne({ email }).select(
      '-password -refreshToken -passwordResetExpires -passwordResetToken -__v'
    )
    if (!user) { next(new ApiError('User not found', 404)); return }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  const { _id: currentUserId } = req.user
  const { id: targetUserId } = req.params

  try {
    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    if (!currentUser || !targetUser) { next(new ApiError('User not found', 404)); return }
    if (currentUser._id.toString() === targetUser._id.toString()) { next(new ApiError('You cannot follow or unfollow yourself', 400)); return }

    const alreadyFollow = currentUser.following.find((data) => data.toString() === targetUser._id.toString())

    let message = ''
    if (!alreadyFollow) {
      currentUser.following.push(targetUser._id)
      targetUser.follower.push(currentUser._id)

      // update number of follower and following
      currentUser.totalFollowing = currentUser.following.length
      targetUser.totalFollower = targetUser.follower.length

      await currentUser.save()
      await targetUser.save()
      message = 'You are follow this user'
    } else {
      // @ts-expect-error : Unreachable code error
      currentUser.following.pull(targetUser._id)
      // @ts-expect-error : Unreachable code error
      targetUser.follower.pull(currentUser._id)

      // update number of follower and following
      currentUser.totalFollowing = currentUser.following.length
      targetUser.totalFollower = targetUser.follower.length

      await currentUser.save()
      await targetUser.save()
      message = 'You are unfollow this user'
    }
    res.status(200).json({
      success: true,
      message
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}
