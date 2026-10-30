import mongoose from 'mongoose'
const vehicleSchema = new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, name:{type:String,required:true,trim:true}, registrationNumber:{type:String,required:true,trim:true}, type:{type:String,enum:['Van','Truck','Refrigerated','Motorcycle'],default:'Van'}, capacity:{type:Number,required:true,min:0}, status:{type:String,enum:['available','in_use','maintenance'],default:'available'} },{timestamps:true})
vehicleSchema.index({owner:1,registrationNumber:1},{unique:true})
export default mongoose.model('Vehicle',vehicleSchema)
