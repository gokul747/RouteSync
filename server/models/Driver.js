import mongoose from 'mongoose'
const driverSchema = new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, name:{type:String,required:true,trim:true}, email:{type:String,required:true,lowercase:true,trim:true}, phone:{type:String,required:true,trim:true}, licenseNumber:{type:String,required:true,trim:true}, status:{type:String,enum:['active','assigned','inactive'],default:'active'} },{timestamps:true})
driverSchema.index({owner:1,email:1},{unique:true})
export default mongoose.model('Driver',driverSchema)
