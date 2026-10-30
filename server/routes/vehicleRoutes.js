import { Router } from 'express'
import { create,list } from '../controllers/vehicleController.js'
const router=Router();router.get('/',list);router.post('/',create);export default router
