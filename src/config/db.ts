/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import mongoose from 'mongoose'

export const db = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGO_URL as string)
    console.log('Database connected')
  } catch (error) {
    console.log(error)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new Error(error as any)
  }
}
