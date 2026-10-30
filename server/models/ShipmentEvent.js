import mongoose from 'mongoose'
const schema = new mongoose.Schema({ owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true}, shipment:{type:mongoose.Schema.Types.ObjectId,ref:'Shipment',required:true}, status:{type:String,required:true}, note:{type:String,trim:true} },{timestamps:true})
export default mongoose.model('ShipmentEvent',schema)
