import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export default async function protect(req,res,next){const header=req.headers.authorization;if(!header?.startsWith('Bearer '))return res.status(401).json({message:'Authentication required.'});try{const decoded=jwt.verify(header.slice(7),process.env.JWT_SECRET);req.user=await User.findById(decoded.id).select('_id name email');if(!req.user)return res.status(401).json({message:'Account no longer exists.'});next()}catch{return res.status(401).json({message:'Invalid or expired token.'})}}
