import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import vehicleRoutes from './routes/vehicleRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import shipmentRoutes from './routes/shipmentRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import User from './models/User.js'
import Vehicle from './models/Vehicle.js'
import Driver from './models/Driver.js'
import Shipment from './models/Shipment.js'
import ShipmentEvent from './models/ShipmentEvent.js'
import protect from './middleware/authMiddleware.js'
import notFound from './middleware/notFoundMiddleware.js'
import { errorHandler } from './middleware/errorMiddleware.js'
const app=express();app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));app.get('/api/health',(req,res)=>res.json({status:'ok'}));app.use('/api/auth',authRoutes);app.use('/api/vehicles',protect,vehicleRoutes);app.use('/api/drivers',protect,driverRoutes);app.use('/api/shipments',protect,shipmentRoutes);app.use('/api/dashboard',protect,dashboardRoutes);app.use(notFound);app.use(errorHandler)
const port=process.env.PORT||5000
const models=[User,Vehicle,Driver,Shipment,ShipmentEvent]
connectDB()
  .then(()=>Promise.all(models.map(model=>model.init())))
  .then(()=>app.listen(port,()=>console.log(`RouteSync API listening on ${port}`)))
  .catch(error=>{console.error('Database initialization failed:',error.message);process.exit(1)})
