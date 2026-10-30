import { Router } from 'express'
import { create,list,listEvents,update } from '../controllers/shipmentController.js'
const router=Router();router.get('/',list);router.post('/',create);router.get('/:id/events',listEvents);router.patch('/:id',update);export default router
