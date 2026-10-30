import Vehicle from '../models/Vehicle.js'
import Driver from '../models/Driver.js'
import Shipment from '../models/Shipment.js'
export async function snapshot(req,res){const owner=req.user._id;const [vehicles,drivers,shipments]=await Promise.all([Vehicle.find({owner}).sort({createdAt:-1}),Driver.find({owner}).sort({createdAt:-1}),Shipment.find({owner}).sort({createdAt:-1}).limit(200)]);res.json({vehicles,drivers,shipments})}
