import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
const issue = user => ({token:jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'}),user:{id:user._id,name:user.name,email:user.email}})
export async function register(req,res){const {name,email,password}=req.body;if(!name||!email||!password)return res.status(400).json({message:'Name, email, and password are required.'});if(password.length<6)return res.status(400).json({message:'Password must be at least 6 characters.'});if(await User.exists({email}))return res.status(409).json({message:'An account with this email already exists.'});const user=await User.create({name,email,password:await bcrypt.hash(password,12)});res.status(201).json(issue(user))}
export async function login(req,res){const {email,password}=req.body;const user=await User.findOne({email}).select('+password');if(!user||!await bcrypt.compare(password||'',user.password))return res.status(401).json({message:'Email or password is incorrect.'});res.json(issue(user))}
