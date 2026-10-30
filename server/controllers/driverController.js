import Driver from '../models/Driver.js'
export async function list(req,res){res.json(await Driver.find({owner:req.user._id}).sort({createdAt:-1}))}
export async function create(req,res){const {name,email,phone,licenseNumber}=req.body;if(!name||!email||!phone||!licenseNumber)return res.status(400).json({message:'Name, email, phone, and license number are required.'});const item=await Driver.create({...req.body,owner:req.user._id});res.status(201).json(item)}
