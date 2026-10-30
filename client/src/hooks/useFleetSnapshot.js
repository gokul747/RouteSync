import { useEffect, useState } from 'react'
import { getVehicles } from '../services/vehicleService'
import { getDrivers } from '../services/driverService'
import { getShipments } from '../services/shipmentService'
export default function useFleetSnapshot() { const [state,setState] = useState({ vehicles: [], drivers: [], shipments: [], loading: true, error: '' }); useEffect(() => { let active = true; Promise.all([getVehicles(),getDrivers(),getShipments()]).then(([vehicles,drivers,shipments]) => active && setState({ vehicles,drivers,shipments,loading:false,error:'' })).catch(error => active && setState(s => ({ ...s,loading:false,error:error.response?.data?.message || 'Could not load your operations. Check the API connection.' }))); return () => { active=false } }, []); return state }
