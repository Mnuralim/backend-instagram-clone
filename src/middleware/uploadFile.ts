import multer, { type Multer } from 'multer'
import { type Request } from 'express'
import ApiError from '../utils/apiError'

const multerFiltering = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/webm'
  ) {
    cb(null, true)
  } else {
    // @ts-expect-error : Unreachable code error
    cb(new ApiError('Wrong file format', 400), false)
  }
}

const upload: Multer = multer({
  fileFilter: multerFiltering,
  limits: {
    fileSize: 5000000
  }
})

export default upload
