import { Router } from 'express'
import { snapshot } from '../controllers/dashboardController.js'
const router=Router();router.get('/',snapshot);export default router
