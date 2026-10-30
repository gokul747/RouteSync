import Vehicle from '../models/Vehicle.js'
export async function list(req,res){res.json(await Vehicle.find({owner:req.user._id}).sort({createdAt:-1}))}
export async function create(req,res){const {name,registrationNumber,type,capacity}=req.body;if(!name||!registrationNumber||capacity===undefined)return res.status(400).json({message:'Name, registration number, and capacity are required.'});const item=await Vehicle.create({...req.body,owner:req.user._id});res.status(201).json(item)}
