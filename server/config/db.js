import mongoose from 'mongoose'

export default async function connectDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/userdb'
  mongoose.set('strictQuery', true)
  await mongoose.connect(mongoUri)
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
}
