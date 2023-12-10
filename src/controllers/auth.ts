/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import ApiError from '../utils/apiError'
import User from '../models/user'
import { type IUser, type RegisterBody } from '../../types'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, email }: RegisterBody = req.body
  try {
    const user: IUser | null = await User.findOne({ email })
    const findUsername: IUser | null = await User.findOne({ username })
    if (user != null) {
      next(new ApiError('Email already registered', 400))
      return
    }

    if (findUsername != null) {
      next(new ApiError('Username already exist', 400))
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      email,
      username,
      password: hashedPassword
    })

    return res.status(201).json({
      success: true,
      message: 'Register successfully'
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const loginWithCredential = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: { email: string, password: string } = req.body
  try {
    const user: IUser | null = await User.findOne({ email })
    if (user == null) {
      next(new ApiError('User not found', 404))
      return
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      next(new ApiError('Wrong password', 400))
      return
    }

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET as string, {
      expiresIn: '1d'
    })

    user.refreshToken = refreshToken
    await user.save()
    res.cookie('refreshToken', refreshToken)

    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        accessToken,
        _id: user._id,
        email: user.email,
        username: user.username
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
  const { email, imageProfile, fullName }: { email: string, fullName: string, imageProfile: string } = req.body

  try {
    const user: IUser | null = await User.findOne({ email })

    let loginUser: IUser | null = user
    const username = email.split('@')[0]

    if (user == null) {
      loginUser = await User.create({
        email,
        username,
        profile: {
          imageProfile,
          fullName
        }
      })
    }

    const payload = {
      _id: loginUser?._id,
      username: loginUser?.username,
      email: loginUser?.email
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '1d'
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESHTOKEN_SECRET as string, {
      expiresIn: '1d'
    })

    if (loginUser) {
      loginUser.refreshToken = refreshToken
      await loginUser?.save()
    }

    res.cookie('refreshToken', refreshToken)

    res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: {
        accessToken
      }
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    const user: IUser | null = await User.findOne({
      refreshToken
    })

    if (!user) return res.sendStatus(204)

    user.refreshToken = ''
    await user.save()

    res.clearCookie('refreshToken')
    res.status(200).json({
      success: true,
      message: 'Logout successfully'
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500))
  }
}

export const checkMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUser = await User.findById(req.user._id).select(
      '-password -refreshToken -passwordResetExpires -passwordResetToken -__v'
    )
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
