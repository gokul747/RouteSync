import Shipment from '../models/Shipment.js'
import ShipmentEvent from '../models/ShipmentEvent.js'
import Vehicle from '../models/Vehicle.js'
import Driver from '../models/Driver.js'
import generateReference from '../utils/generateReference.js'
export async function list(req,res){res.json(await Shipment.find({owner:req.user._id}).populate('driver','name phone').populate('vehicle','name registrationNumber type capacity').sort({createdAt:-1}))}
export async function listEvents(req,res){
  const shipment=await Shipment.exists({_id:req.params.id,owner:req.user._id})
  if(!shipment)return res.status(404).json({message:'Shipment not found.'})
  res.json(await ShipmentEvent.find({owner:req.user._id,shipment:req.params.id}).sort({createdAt:1}))
}
export async function create(req,res){
  const {destination,customerName,weight}=req.body
  if(!destination||!customerName||weight===undefined)return res.status(400).json({message:'Destination, customer name, and weight are required.'})
  const owner=req.user._id
  const item=await Shipment.create({...req.body,owner,reference:generateReference(),status:'pending',driver:null,vehicle:null})
  const inProgress={owner,status:{$in:['assigned','in_transit','delayed']}}
  const activeShipments=await Shipment.find(inProgress).select('driver vehicle')
  const busyDrivers=activeShipments.map(s=>s.driver).filter(Boolean)
  const busyVehicles=activeShipments.map(s=>s.vehicle).filter(Boolean)
  const [driver,vehicle]=await Promise.all([
    Driver.findOne({owner,status:'active',_id:{$nin:busyDrivers}}).sort({createdAt:1}),
    Vehicle.findOne({owner,status:'available',_id:{$nin:busyVehicles},capacity:{$gte:Number(weight)}}).sort({capacity:1,createdAt:1}),
  ])
  let note='Shipment created; no eligible driver or vehicle was available for automatic assignment.'
  if(driver&&vehicle){
    const reserved=await Vehicle.updateOne({_id:vehicle._id,owner,status:'available'},{$set:{status:'in_use'}})
    if(reserved.modifiedCount){
      driver.status='assigned';await driver.save()
      item.driver=driver._id;item.vehicle=vehicle._id;item.status='assigned';await item.save()
      note=`Automatically assigned to ${driver.name} and ${vehicle.name}.`
    }
  }
  await ShipmentEvent.create({owner,shipment:item._id,status:item.status,note})
  await item.populate('driver','name phone');await item.populate('vehicle','name registrationNumber type capacity')
  res.status(201).json(item)
}
export async function update(req,res){
  const shipment=await Shipment.findOne({owner:req.user._id,_id:req.params.id})
  if(!shipment)return res.status(404).json({message:'Shipment not found.'})
  if(req.body.status&&!['pending','assigned','in_transit','delivered','delayed'].includes(req.body.status))return res.status(400).json({message:'Invalid shipment status.'})
  const previousStatus=shipment.status
  Object.assign(shipment,req.body)
  await shipment.save()
  if(shipment.status==='delivered'&&previousStatus!=='delivered'){
    if(shipment.vehicle)await Vehicle.updateOne({_id:shipment.vehicle,owner:req.user._id,status:'in_use'},{$set:{status:'available'}})
    if(shipment.driver)await Driver.updateOne({_id:shipment.driver,owner:req.user._id,status:'assigned'},{$set:{status:'active'}})
  }
  await ShipmentEvent.create({owner:req.user._id,shipment:shipment._id,status:shipment.status,note:req.body.note||'Shipment updated'})
  await shipment.populate('driver','name phone');await shipment.populate('vehicle','name registrationNumber type capacity')
  res.json(shipment)
}
